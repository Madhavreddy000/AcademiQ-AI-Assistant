package com.university.academicassistant.document;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    Optional<Document> findByFileHash(String fileHash);
    List<Document> findByCategory(DocumentCategory category);
    List<Document> findByDepartmentId(Long departmentId);
    List<Document> findByStatus(DocumentStatus status);

    @Query("SELECT SUM(d.chunkCount) FROM Document d WHERE d.status = 'INDEXED'")
    Long countTotalIndexedChunks();

    @Query("SELECT COUNT(d) FROM Document d WHERE d.status = 'INDEXED'")
    Long countTotalIndexedDocuments();
}
