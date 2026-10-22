package com.university.academicassistant.academic;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "department_id", nullable = false)
    private Long departmentId;

    @Column(nullable = false, unique = true, length = 32)
    private String code;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "degree_level", length = 50)
    private String degreeLevel = "Undergraduate";

    @Column(name = "total_semesters", nullable = false)
    private Integer totalSemesters = 8;

    @Column(nullable = false)
    private Integer credits = 160;

    @Column(columnDefinition = "TEXT")
    private String description;

    public Course() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDegreeLevel() { return degreeLevel; }
    public void setDegreeLevel(String degreeLevel) { this.degreeLevel = degreeLevel; }

    public Integer getTotalSemesters() { return totalSemesters; }
    public void setTotalSemesters(Integer totalSemesters) { this.totalSemesters = totalSemesters; }

    public Integer getCredits() { return credits; }
    public void setCredits(Integer credits) { this.credits = credits; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
