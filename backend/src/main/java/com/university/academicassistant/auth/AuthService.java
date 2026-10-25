package com.university.academicassistant.auth;

import com.university.academicassistant.config.JwtTokenProvider;
import com.university.academicassistant.user.Role;
import com.university.academicassistant.user.User;
import com.university.academicassistant.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String studentId = request.getStudentIdNumber() != null ? request.getStudentIdNumber().trim() : null;
        if (studentId != null && !studentId.isEmpty() && userRepository.existsByStudentIdNumber(studentId)) {
            throw new IllegalArgumentException("An account with this Roll Number / Employee ID is already registered: " + studentId);
        }

        String email = request.getEmail();
        if (email == null || email.isBlank()) {
            if (studentId != null && !studentId.isEmpty()) {
                String cleanId = studentId.replaceAll("[^a-zA-Z0-9.-]", "").toLowerCase();
                email = cleanId + "@ggu.edu.in";
            } else {
                email = "user" + System.currentTimeMillis() + "@ggu.edu.in";
            }
        } else {
            email = email.trim().toLowerCase();
        }

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email / ID is already registered: " + email);
        }

        Role role = request.getRole() != null ? request.getRole() : Role.STUDENT;
        String name = request.getFullName();
        if (name == null || name.isBlank()) {
            name = (role == Role.FACULTY ? "Faculty " : "Student ") + (studentId != null ? studentId : "Member");
        }

        User user = new User(
                email,
                passwordEncoder.encode(request.getPassword()),
                name,
                role
        );
        user.setDepartmentId(request.getDepartmentId());
        user.setCurrentSemester(request.getCurrentSemester());
        user.setStudentIdNumber(studentId);
        user.setStream(request.getStream());

        User savedUser = userRepository.save(user);

        String token = tokenProvider.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole().name());
        String refreshToken = tokenProvider.generateRefreshToken(savedUser.getEmail());

        return new AuthResponse(token, refreshToken, savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        String identifier = request.getEffectiveIdentifier();
        if (identifier.isBlank()) {
            throw new IllegalArgumentException("Roll Number, Employee ID, or Email is required");
        }

        User user = userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByStudentIdNumber(identifier))
                .orElseThrow(() -> new IllegalArgumentException("Invalid Roll Number / Employee ID / Email or password"));

        // If a role was specified in the login form, enforce role boundaries
        if (request.getRole() != null && !request.getRole().isBlank()) {
            if (!request.getRole().equalsIgnoreCase(user.getRole().name()) && user.getRole() != Role.ADMIN) {
                throw new IllegalArgumentException("This account is registered as " + user.getRole().name() + ". Please use the " + user.getRole().name().toLowerCase() + " login portal.");
            }
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid Roll Number / Employee ID / Email or password");
        }

        if (!user.isActive()) {
            throw new IllegalStateException("User account has been deactivated. Contact university registrar.");
        }

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        return new AuthResponse(token, refreshToken, user);
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid or expired refresh token");
        }

        String email = tokenProvider.getEmailFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String newToken = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(newToken, refreshToken, user);
    }

    public User getAuthenticatedUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
