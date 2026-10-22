package com.university.academicassistant.chat;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "conversation_id", nullable = false)
    private Long conversationId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private SenderType sender; // USER, ASSISTANT, SYSTEM

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String content;

    @Column(name = "is_rag_grounded", nullable = false)
    private boolean isRagGrounded = false;

    @Column(name = "is_unverified", nullable = false)
    private boolean isUnverified = false;

    @Column(name = "model_used", length = 64)
    private String modelUsed;

    @Column(name = "prompt_tokens")
    private Integer promptTokens;

    @Column(name = "completion_tokens")
    private Integer completionTokens;

    @Column(name = "latency_ms")
    private Integer latencyMs;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum SenderType {
        USER,
        ASSISTANT,
        SYSTEM
    }

    public Message() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }

    public SenderType getSender() { return sender; }
    public void setSender(SenderType sender) { this.sender = sender; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public boolean isRagGrounded() { return isRagGrounded; }
    public void setRagGrounded(boolean ragGrounded) { isRagGrounded = ragGrounded; }

    public boolean isUnverified() { return isUnverified; }
    public void setUnverified(boolean unverified) { isUnverified = unverified; }

    public String getModelUsed() { return modelUsed; }
    public void setModelUsed(String modelUsed) { this.modelUsed = modelUsed; }

    public Integer getPromptTokens() { return promptTokens; }
    public void setPromptTokens(Integer promptTokens) { this.promptTokens = promptTokens; }

    public Integer getCompletionTokens() { return completionTokens; }
    public void setCompletionTokens(Integer completionTokens) { this.completionTokens = completionTokens; }

    public Integer getLatencyMs() { return latencyMs; }
    public void setLatencyMs(Integer latencyMs) { this.latencyMs = latencyMs; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
