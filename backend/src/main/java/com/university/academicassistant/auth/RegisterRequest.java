package com.university.academicassistant.auth;

import com.university.academicassistant.user.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    private String fullName;
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private Role role = Role.STUDENT;
    private Long departmentId;
    private String departmentCode;
    private Integer currentSemester;
    private Integer academicYear;
    private String studentIdNumber; // Roll No or Emp ID
    private String stream; // BTech, MTech, MBA, etc.

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }

    public Integer getCurrentSemester() { return currentSemester; }
    public void setCurrentSemester(Integer currentSemester) { this.currentSemester = currentSemester; }

    public Integer getAcademicYear() { return academicYear; }
    public void setAcademicYear(Integer academicYear) { this.academicYear = academicYear; }

    public String getStudentIdNumber() { return studentIdNumber; }
    public void setStudentIdNumber(String studentIdNumber) { this.studentIdNumber = studentIdNumber; }

    public String getStream() { return stream; }
    public void setStream(String stream) { this.stream = stream; }
}
