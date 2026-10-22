package com.university.academicassistant.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CitationRepository extends JpaRepository<MessageCitation, Long> {
    List<MessageCitation> findByMessageId(Long messageId);
}
