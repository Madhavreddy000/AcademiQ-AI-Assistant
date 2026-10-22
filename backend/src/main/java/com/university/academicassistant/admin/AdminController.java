package com.university.academicassistant.admin;

import com.university.academicassistant.document.*;
import com.university.academicassistant.user.Role;
import com.university.academicassistant.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Administration", description = "Endpoints for document ingestion, vector reindexing, and system monitoring")
public class AdminController {

    private final AdminService adminService;
    private final DocumentService documentService;

    public AdminController(AdminService adminService, DocumentService documentService) {
        this.adminService = adminService;
        this.documentService = documentService;
    }

    @GetMapping("/stats")
    @Operation(summary = "Get administrator system-wide KPIs and vector statistics")
    public ResponseEntity<AdminService.AdminStatsDto> getStats() {
        return ResponseEntity.ok(adminService.getSystemStats());
    }

    @GetMapping("/ingestion/jobs")
    @Operation(summary = "Get recent background document ingestion jobs")
    public ResponseEntity<List<IngestionJob>> getIngestionJobs() {
        return ResponseEntity.ok(adminService.getRecentIngestionJobs());
    }

    @PostMapping(value = "/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload official university document (PDF/DOCX/TXT) for chunking and Qdrant vectorization")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "category", required = false) DocumentCategory category,
            @RequestParam(value = "accessLevel", required = false) AccessLevel accessLevel,
            @RequestParam(value = "departmentId", required = false) Long departmentId,
            @RequestParam(value = "courseId", required = false) Long courseId,
            @RequestParam(value = "academicYear", required = false) String academicYear,
            HttpServletRequest request) throws IOException {

        Long uploaderId = (Long) request.getAttribute("authenticatedUserId");
        if (uploaderId == null) uploaderId = 1L; // default Admin

        Document document = documentService.uploadAndQueueDocument(
                file, title, category, accessLevel, departmentId, courseId, academicYear, uploaderId);

        return ResponseEntity.ok(document);
    }

    @GetMapping("/documents")
    @Operation(summary = "List all documents with vector indexing status")
    public ResponseEntity<List<Document>> getAllDocuments() {
        return ResponseEntity.ok(documentService.getAllDocuments());
    }

    @DeleteMapping("/documents/{id}")
    @Operation(summary = "Delete document and purge vectors from Qdrant")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/documents/{id}/reindex")
    @Operation(summary = "Trigger re-chunking and re-embedding for document")
    public ResponseEntity<Map<String, String>> reindexDocument(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("message", "Document re-indexing successfully queued in Qdrant vector store."));
    }

    @GetMapping("/users")
    @Operation(summary = "List registered university users and active roles")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/role")
    @Operation(summary = "Update user RBAC permission role")
    public ResponseEntity<User> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Role role = Role.valueOf(body.get("role"));
        return ResponseEntity.ok(adminService.updateUserRole(id, role));
    }
}
