package com.university.academicassistant.document;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "document_chunks")
public class DocumentChunk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "document_id", nullable = false)
    private Long documentId;

    @Column(name = "chunk_index", nullable = false)
    private Integer chunkIndex;

    @Column(name = "page_number", nullable = false)
    private Integer pageNumber = 1;

    @Column(name = "qdrant_point_id", nullable = false, unique = true, length = 64)
    private String qdrantPointId;

    @Column(name = "token_count", nullable = false)
    private Integer tokenCount = 0;

    @Column(name = "chunk_text", nullable = false, columnDefinition = "MEDIUMTEXT")
    private String chunkText;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public DocumentChunk() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDocumentId() { return documentId; }
    public void setDocumentId(Long documentId) { this.documentId = documentId; }

    public Integer getChunkIndex() { return chunkIndex; }
    public void setChunkIndex(Integer chunkIndex) { this.chunkIndex = chunkIndex; }

    public Integer getPageNumber() { return pageNumber; }
    public void setPageNumber(Integer pageNumber) { this.pageNumber = pageNumber; }

    public String getQdrantPointId() { return qdrantPointId; }
    public void setQdrantPointId(String qdrantPointId) { this.qdrantPointId = qdrantPointId; }

    public Integer getTokenCount() { return tokenCount; }
    public void setTokenCount(Integer tokenCount) { this.tokenCount = tokenCount; }

    public String getChunkText() { return chunkText; }
    public void setChunkText(String chunkText) { this.chunkText = chunkText; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
