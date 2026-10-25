package com.university.academicassistant.auth;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    private String email;
    private String identifier;
    private String rollNo;
    private String empId;
    private String role;

    @NotBlank(message = "Password is required")
    private String password;

    public String getEffectiveIdentifier() {
        if (identifier != null && !identifier.isBlank()) return identifier.trim();
        if (rollNo != null && !rollNo.isBlank()) return rollNo.trim();
        if (empId != null && !empId.isBlank()) return empId.trim();
        if (email != null && !email.isBlank()) return email.trim();
        return "";
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }

    public String getRollNo() { return rollNo; }
    public void setRollNo(String rollNo) { this.rollNo = rollNo; }

    public String getEmpId() { return empId; }
    public void setEmpId(String empId) { this.empId = empId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
