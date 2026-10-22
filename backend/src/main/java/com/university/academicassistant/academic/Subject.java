package com.university.academicassistant.academic;

import jakarta.persistence.*;

@Entity
@Table(name = "subjects")
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(nullable = false, unique = true, length = 32)
    private String code;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false)
    private Integer semester;

    @Column(nullable = false)
    private Integer credits = 4;

    @Column(name = "syllabus_summary", columnDefinition = "TEXT")
    private String syllabusSummary;

    public Subject() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public Integer getCredits() { return credits; }
    public void setCredits(Integer credits) { this.credits = credits; }

    public String getSyllabusSummary() { return syllabusSummary; }
    public void setSyllabusSummary(String syllabusSummary) { this.syllabusSummary = syllabusSummary; }
}
