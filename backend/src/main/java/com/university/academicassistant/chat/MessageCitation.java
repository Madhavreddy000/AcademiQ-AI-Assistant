package com.university.academicassistant.chat;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "message_citations")
public class MessageCitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "message_id", nullable = false)
    private Long messageId;

    @Column(name = "document_id")
    private Long documentId;

    @Column(name = "chunk_id")
    private Long chunkId;

    @Column(name = "document_title", nullable = false, length = 255)
    private String documentTitle;

    @Column(name = "page_number", nullable = false)
    private Integer pageNumber = 1;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String snippet;

    @Column(name = "relevance_score", nullable = false)
    private Double relevanceScore = 0.0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public MessageCitation() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMessageId() { return messageId; }
    public void setMessageId(Long messageId) { this.messageId = messageId; }

    public Long getDocumentId() { return documentId; }
    public void setDocumentId(Long documentId) { this.documentId = documentId; }

    public Long getChunkId() { return chunkId; }
    public void setChunkId(Long chunkId) { this.chunkId = chunkId; }

    public String getDocumentTitle() { return documentTitle; }
    public void setDocumentTitle(String documentTitle) { this.documentTitle = documentTitle; }

    public Integer getPageNumber() { return pageNumber; }
    public void setPageNumber(Integer pageNumber) { this.pageNumber = pageNumber; }

    public String getSnippet() { return snippet; }
    public void setSnippet(String snippet) { this.snippet = snippet; }

    public Double getRelevanceScore() { return relevanceScore; }
    public void setRelevanceScore(Double relevanceScore) { this.relevanceScore = relevanceScore; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
