package com.campus.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String role = request.get("role");
        if (role == null || role.isEmpty()) {
            return ResponseEntity.badRequest().body("Role is required");
        }

        // Mock authentication - in real app, validate credentials
        Map<String, Object> response = new HashMap<>();
        response.put("token", "mock-jwt-token-" + role);
        Map<String, Object> user = new HashMap<>();
        user.put("id", 1);
        user.put("name", "Test User");
        user.put("email", "test@example.com");
        user.put("role", role);
        response.put("user", user);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        // Mock user - in real app, decode token and get user
        Map<String, Object> user = new HashMap<>();
        user.put("id", 1);
        user.put("name", "Test User");
        user.put("email", "test@example.com");
        String role = "USER";
        if (authHeader != null) {
            if (authHeader.endsWith("-ADMIN")) role = "ADMIN";
            else if (authHeader.endsWith("-TECHNICIAN")) role = "TECHNICIAN";
            else if (authHeader.contains("admin")) role = "ADMIN";
        }
        user.put("role", role);

        return ResponseEntity.ok(user);
    }
}