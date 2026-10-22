package com.university.academicassistant.document;

import com.university.academicassistant.rag.VectorStoreService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class DocumentService {

    private static final Logger log = LoggerFactory.getLogger(DocumentService.class);

    private final DocumentRepository documentRepository;
    private final DocumentChunkRepository chunkRepository;
    private final IngestionJobRepository jobRepository;
    private final DocumentParser documentParser;
    private final DocumentChunker documentChunker;
    private final VectorStoreService vectorStoreService;
    private final String uploadDir;

    public DocumentService(
            DocumentRepository documentRepository,
            DocumentChunkRepository chunkRepository,
            IngestionJobRepository jobRepository,
            DocumentParser documentParser,
            DocumentChunker documentChunker,
            VectorStoreService vectorStoreService,
            @Value("${app.upload.dir:./uploads}") String uploadDir) {
        this.documentRepository = documentRepository;
        this.chunkRepository = chunkRepository;
        this.jobRepository = jobRepository;
        this.documentParser = documentParser;
        this.documentChunker = documentChunker;
        this.vectorStoreService = vectorStoreService;
        this.uploadDir = uploadDir;
    }

    @Transactional
    public Document uploadAndQueueDocument(
            MultipartFile file,
            String title,
            DocumentCategory category,
            AccessLevel accessLevel,
            Long departmentId,
            Long courseId,
            String academicYear,
            Long uploaderId) throws IOException {

        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) originalFilename = "document.pdf";
        String extension = getFileExtension(originalFilename).toUpperCase();

        if (!List.of("PDF", "DOCX", "TXT").contains(extension)) {
            throw new IllegalArgumentException("Unsupported file type: " + extension + ". Allowed: PDF, DOCX, TXT");
        }

        byte[] bytes = file.getBytes();
        String fileHash = calculateSha256(bytes);

        // Check if duplicate file
        Optional<Document> existing = documentRepository.findByFileHash(fileHash);
        if (existing.isPresent()) {
            return existing.get();
        }

        // Save file to uploads folder
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        String storedFileName = System.currentTimeMillis() + "_" + originalFilename;
        Path targetPath = uploadPath.resolve(storedFileName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // Create Document entity
        Document document = new Document();
        document.setTitle(title != null && !title.isBlank() ? title : originalFilename);
        document.setFileName(originalFilename);
        document.setFileType(extension);
        document.setFileSizeBytes(file.getSize());
        document.setFileHash(fileHash);
        document.setStoragePath(targetPath.toAbsolutePath().toString());
        document.setCategory(category != null ? category : DocumentCategory.HANDBOOK);
        document.setAccessLevel(accessLevel != null ? accessLevel : AccessLevel.STUDENT);
        document.setDepartmentId(departmentId);
        document.setCourseId(courseId);
        document.setAcademicYear(academicYear != null ? academicYear : "2025-2026");
        document.setUploadedBy(uploaderId);
        document.setStatus(DocumentStatus.PENDING);

        Document savedDoc = documentRepository.save(document);

        // Create Ingestion Job
        IngestionJob job = new IngestionJob(savedDoc.getId());
        jobRepository.save(job);

        // Trigger async extraction and vectorization
        processDocumentAsync(savedDoc.getId(), targetPath.toFile(), job.getId());

        return savedDoc;
    }

    @Async("documentIngestionExecutor")
    public void processDocumentAsync(Long documentId, File file, Long jobId) {
        log.info("Starting background ingestion for document id: {}", documentId);
        Optional<Document> docOpt = documentRepository.findById(documentId);
        Optional<IngestionJob> jobOpt = jobRepository.findById(jobId);

        if (docOpt.isEmpty() || jobOpt.isEmpty()) return;

        Document document = docOpt.get();
        IngestionJob job = jobOpt.get();

        try {
            document.setStatus(DocumentStatus.PROCESSING);
            documentRepository.save(document);

            job.setStatus(IngestionJob.JobStatus.EXTRACTING);
            job.setProgressPercent(20);
            job.setStartedAt(LocalDateTime.now());
            jobRepository.save(job);

            // 1. Text Extraction
            List<DocumentParser.PageContent> pages = documentParser.parseDocument(file, document.getFileType());
            document.setTotalPages(pages.size());

            job.setStatus(IngestionJob.JobStatus.CHUNKING);
            job.setProgressPercent(50);
            jobRepository.save(job);

            // 2. Semantic Chunking
            List<DocumentChunker.RawChunk> rawChunks = documentChunker.splitPagesIntoChunks(pages);

            // 3. MySQL and Spring AI Vector preparation
            List<org.springframework.ai.document.Document> aiDocuments = new ArrayList<>();
            List<DocumentChunk> entityChunks = new ArrayList<>();

            job.setStatus(IngestionJob.JobStatus.EMBEDDING);
            job.setProgressPercent(75);
            jobRepository.save(job);

            for (DocumentChunker.RawChunk raw : rawChunks) {
                String pointId = UUID.randomUUID().toString();

                DocumentChunk chunkEntity = new DocumentChunk();
                chunkEntity.setDocumentId(document.getId());
                chunkEntity.setChunkIndex(raw.getChunkIndex());
                chunkEntity.setPageNumber(raw.getPageNumber());
                chunkEntity.setQdrantPointId(pointId);
                chunkEntity.setTokenCount(raw.getTokenCount());
                chunkEntity.setChunkText(raw.getText());
                entityChunks.add(chunkEntity);

                // Spring AI Document with rich Qdrant metadata payload
                Map<String, Object> metadata = new HashMap<>();
                metadata.put("documentId", document.getId());
                metadata.put("title", document.getTitle());
                metadata.put("pageNumber", raw.getPageNumber());
                metadata.put("chunkIndex", raw.getChunkIndex());
                metadata.put("category", document.getCategory().name());
                metadata.put("accessLevel", document.getAccessLevel().name());
                if (document.getDepartmentId() != null) metadata.put("departmentId", document.getDepartmentId());
                if (document.getCourseId() != null) metadata.put("courseId", document.getCourseId());

                aiDocuments.add(new org.springframework.ai.document.Document(pointId, raw.getText(), metadata));
            }

            // Persist chunks to MySQL
            chunkRepository.saveAll(entityChunks);

            // Store embeddings & payloads in Qdrant
            vectorStoreService.storeChunks(aiDocuments);

            // Update status to INDEXED
            document.setChunkCount(rawChunks.size());
            document.setStatus(DocumentStatus.INDEXED);
            documentRepository.save(document);

            job.setStatus(IngestionJob.JobStatus.COMPLETED);
            job.setProgressPercent(100);
            job.setFinishedAt(LocalDateTime.now());
            job.setLogDetails(String.format("Successfully indexed %d pages into %d vector chunks in Qdrant.",
                    pages.size(), rawChunks.size()));
            jobRepository.save(job);

            log.info("Document id: {} indexed successfully with {} chunks", documentId, rawChunks.size());

        } catch (Exception ex) {
            log.error("Failed to ingest document id: {}", documentId, ex);
            document.setStatus(DocumentStatus.FAILED);
            document.setErrorMessage(ex.getMessage());
            documentRepository.save(document);

            job.setStatus(IngestionJob.JobStatus.FAILED);
            job.setLogDetails("Ingestion error: " + ex.getMessage());
            job.setFinishedAt(LocalDateTime.now());
            jobRepository.save(job);
        }
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public Optional<Document> getDocumentById(Long id) {
        return documentRepository.findById(id);
    }

    @Transactional
    public void deleteDocument(Long id) {
        documentRepository.findById(id).ifPresent(doc -> {
            // Delete file from disk
            try {
                Files.deleteIfExists(Paths.get(doc.getStoragePath()));
            } catch (IOException ignored) {}

            // Delete vectors from Qdrant
            vectorStoreService.deleteDocumentChunks(id);

            // Delete MySQL records
            chunkRepository.deleteByDocumentId(id);
            documentRepository.delete(doc);
        });
    }

    private String getFileExtension(String filename) {
        int idx = filename.lastIndexOf('.');
        return idx > 0 ? filename.substring(idx + 1) : "";
    }

    private String calculateSha256(byte[] data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data);
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}
