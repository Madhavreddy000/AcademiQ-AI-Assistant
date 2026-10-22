package com.university.academicassistant.chat;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "conversations")
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, length = 255)
    private String title = "New Conversation";

    @Column(nullable = false)
    private boolean pinned = false;

    @Column(name = "academic_context_dept_id")
    private Long academicContextDeptId;

    @Column(name = "academic_context_course_id")
    private Long academicContextCourseId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Conversation() {}

    public Conversation(Long userId, String title) {
        this.userId = userId;
        this.title = title;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public boolean isPinned() { return pinned; }
    public void setPinned(boolean pinned) { this.pinned = pinned; }

    public Long getAcademicContextDeptId() { return academicContextDeptId; }
    public void setAcademicContextDeptId(Long academicContextDeptId) { this.academicContextDeptId = academicContextDeptId; }

    public Long getAcademicContextCourseId() { return academicContextCourseId; }
    public void setAcademicContextCourseId(Long academicContextCourseId) { this.academicContextCourseId = academicContextCourseId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
