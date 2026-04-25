package com.project.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;
    
    private String name;
    
    private String email;
    
    private String password;
    
    private Role role;
    
    private AuthProvider provider;

    // Google profile picture URL (set on OAuth registration/update)
    private String avatar;
    
    // Extended profile fields
    private String phoneNumber;
    private String studentId;
    private String faculty;
    private String batch;
    
    // Technician specific fields
    private String department;
    private String specialty;
    private Integer experienceYears;
    private String bio;
    private String address;
    private List<String> expertise;
    private List<String> workLocations;
    private String workingHours;
    private Boolean availability;
    
    // Verification fields
    @Builder.Default
    private boolean enabled = true;
    private String verificationCode;
    private LocalDateTime verificationExpiry;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
