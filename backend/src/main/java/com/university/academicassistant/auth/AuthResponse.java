package com.university.academicassistant.auth;

import com.university.academicassistant.user.User;

public class AuthResponse {
    private String token;
    private String refreshToken;
    private String tokenType = "Bearer";
    private UserDto user;

    public AuthResponse(String token, String refreshToken, User user) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.user = new UserDto(user);
    }

    public String getToken() { return token; }
    public String getRefreshToken() { return refreshToken; }
    public String getTokenType() { return tokenType; }
    public UserDto getUser() { return user; }

    public static class UserDto {
        private Long id;
        private String email;
        private String fullName;
        private String role;
        private Long departmentId;
        private Integer currentSemester;
        private String studentIdNumber;

        public UserDto(User user) {
            this.id = user.getId();
            this.email = user.getEmail();
            this.fullName = user.getFullName();
            this.role = user.getRole().name();
            this.departmentId = user.getDepartmentId();
            this.currentSemester = user.getCurrentSemester();
            this.studentIdNumber = user.getStudentIdNumber();
        }

        public Long getId() { return id; }
        public String getEmail() { return email; }
        public String getFullName() { return fullName; }
        public String getRole() { return role; }
        public Long getDepartmentId() { return departmentId; }
        public Integer getCurrentSemester() { return currentSemester; }
        public String getStudentIdNumber() { return studentIdNumber; }
    }
}
