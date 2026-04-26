package com.project.controller;

import com.project.dto.AuthResponse;
import com.project.dto.LoginRequest;
import com.project.dto.RegisterRequest;
import com.project.model.AuthProvider;
import com.project.model.Role;
import com.project.model.User;
import com.project.repository.UserRepository;
import com.project.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.project.service.FileStorageService;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private com.project.service.EmailService emailService;

    @Autowired
    private FileStorageService fileStorageService;

    private String generateOtp() {
        return String.valueOf((int) ((Math.random() * (999999 - 100000)) + 100000));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        return ResponseEntity.ok(new AuthResponse(jwt));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if(userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            User existingUser = userRepository.findByEmail(registerRequest.getEmail()).get();
            if (existingUser.isEnabled()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email already in use!"));
            } else {
                // If user exists but is not enabled, update their details and resend OTP
                existingUser.setName(registerRequest.getName());
                existingUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
                String otp = generateOtp();
                existingUser.setVerificationCode(otp);
                existingUser.setVerificationExpiry(LocalDateTime.now().plusMinutes(10));
                userRepository.save(existingUser);
                try {
                    emailService.sendOtpEmail(existingUser.getEmail(), otp);
                } catch (Exception e) {
                    return ResponseEntity.ok(Map.of("message", "Verification code resent. Email failed, please check server console."));
                }
                return ResponseEntity.ok(Map.of("message", "Verification code resent. Please check your email."));
            }
        }

        // Creating user's account but disabled
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setRole(Role.USER);
        user.setProvider(AuthProvider.LOCAL);
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        
        // OTP setup
        String otp = generateOtp();
        user.setVerificationCode(otp);
        user.setVerificationExpiry(LocalDateTime.now().plusMinutes(10));
        user.setEnabled(false); // DISABLED until verified

        userRepository.save(user);
        
        try {
            emailService.sendOtpEmail(user.getEmail(), otp);
        } catch (Exception e) {
            // In development, we allow this to fail and assume the user checks the console
            return ResponseEntity.ok(Map.of("message", "Registration initiated. Email delivery failed, but you can find your OTP in the server console (Dev Mode)."));
        }

        return ResponseEntity.ok(Map.of("message", "Registration initiated. Please verify your email with the OTP sent."));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody com.project.dto.VerifyRequest verifyRequest) {
        User user = userRepository.findByEmail(verifyRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isEnabled()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Account is already verified"));
        }

        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(verifyRequest.getOtp())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid verification code"));
        }

        if (user.getVerificationExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Verification code has expired"));
        }

        user.setEnabled(true);
        user.setVerificationCode(null);
        user.setVerificationExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Account verified successfully! You can now login."));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isEnabled()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Account is already verified"));
        }

        String otp = generateOtp();
        user.setVerificationCode(otp);
        user.setVerificationExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        try {
            emailService.sendOtpEmail(user.getEmail(), otp);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("message", "A new code was generated. Email failed, please check server console."));
        }

        return ResponseEntity.ok(Map.of("message", "A new verification code has been sent to your email."));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        
        com.project.security.UserPrincipal userPrincipal = (com.project.security.UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId()).orElse(null);
        return ResponseEntity.ok(user);
    }
    
    @PatchMapping("/me")
    @SuppressWarnings("unchecked")
    public ResponseEntity<?> updateCurrentUser(@RequestBody Map<String, Object> updates) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        
        com.project.security.UserPrincipal userPrincipal = (com.project.security.UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId()).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        
        if (updates.containsKey("name")) user.setName((String) updates.get("name"));
        if (updates.containsKey("phoneNumber")) user.setPhoneNumber((String) updates.get("phoneNumber"));
        if (updates.containsKey("studentId")) user.setStudentId((String) updates.get("studentId"));
        if (updates.containsKey("faculty")) user.setFaculty((String) updates.get("faculty"));
        if (updates.containsKey("batch")) user.setBatch((String) updates.get("batch"));
        if (updates.containsKey("department")) user.setDepartment((String) updates.get("department"));
        if (updates.containsKey("expertise")) user.setExpertise((List<String>) updates.get("expertise"));
        if (updates.containsKey("workLocations")) user.setWorkLocations((List<String>) updates.get("workLocations"));
        if (updates.containsKey("workingHours")) user.setWorkingHours((String) updates.get("workingHours"));
        if (updates.containsKey("availability")) user.setAvailability((Boolean) updates.get("availability"));
        
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> body) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }
        
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");
        
        com.project.security.UserPrincipal userPrincipal = (com.project.security.UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId()).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        
        if (user.getProvider() != AuthProvider.LOCAL) {
             return ResponseEntity.badRequest().body(Map.of("message", "OAuth users cannot change passwords"));
        }
        
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Current password is incorrect"));
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }

    @PostMapping("/upload-avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("avatar") MultipartFile file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }
        
        com.project.security.UserPrincipal userPrincipal = (com.project.security.UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId()).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        
        try {
            String fileName = fileStorageService.storeFile(file);
            // Construct the URL to access the uploaded file
            String fileUrl = "http://localhost:8081/uploads/" + fileName;
            user.setAvatar(fileUrl);
            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to upload avatar: " + e.getMessage()));
        }
    }
}
