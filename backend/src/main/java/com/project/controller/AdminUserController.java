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

    @Autowired
    private com.project.service.NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/technicians")
    public ResponseEntity<List<User>> getTechnicians() {
        List<User> technicians = userService.getAllUsers().stream()
                .filter(u -> u.getRole() == com.project.model.Role.TECHNICIAN)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(technicians);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable String id, @Valid @RequestBody RoleUpdateRequest request) {
        Optional<User> userOptional = userService.getUserById(id);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setRole(request.getRole());
            userService.updateUser(user);
            String title = request.getRole() == com.project.model.Role.TECHNICIAN ? "New Technician Assigned" : "User Role Updated";
            notificationService.notifyAdmins(title, 
                "User '" + user.getName() + "' is now assigned as " + request.getRole(), 
                com.project.model.NotificationType.USER_DIRECTORY);
            return ResponseEntity.ok(user);
        }
        
        return ResponseEntity.notFound().build();
    }
}
