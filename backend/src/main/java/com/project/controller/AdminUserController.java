package com.project.controller;

import com.project.dto.RoleUpdateRequest;
import com.project.model.User;
import com.project.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        java.util.Map<String, Long> stats = new java.util.HashMap<>();
        stats.put("totalUsers", userService.countTotalUsers());
        stats.put("admins", userService.countUsersByRole(com.project.model.Role.ADMIN));
        stats.put("technicians", userService.countUsersByRole(com.project.model.Role.TECHNICIAN));
        stats.put("managers", userService.countUsersByRole(com.project.model.Role.MANAGER));
        stats.put("students", userService.countUsersByRole(com.project.model.Role.USER));
        return ResponseEntity.ok(stats);
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable String id, @Valid @RequestBody RoleUpdateRequest request) {
        Optional<User> userOptional = userService.getUserById(id);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setRole(request.getRole());
            userService.updateUser(user);
            return ResponseEntity.ok(user);
        }
        
        return ResponseEntity.notFound().build();
    }
}
