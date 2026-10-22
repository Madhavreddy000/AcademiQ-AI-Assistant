package com.university.academicassistant.document;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IngestionJobRepository extends JpaRepository<IngestionJob, Long> {
    Optional<IngestionJob> findByDocumentId(Long documentId);
    List<IngestionJob> findTop10ByOrderByCreatedAtDesc();
}
