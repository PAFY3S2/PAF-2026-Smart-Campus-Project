package com.project.config;

import com.project.model.AuthProvider;
import com.project.model.Role;
import com.project.model.User;
import com.project.model.Resource;
import com.project.model.ResourceType;
import com.project.model.ResourceStatus;
import com.project.repository.UserRepository;
import com.project.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void addResourceHandlers(@org.springframework.lang.NonNull ResourceHandlerRegistry registry) {
        // exposeDirectory(uploadDir, registry);
    }

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "pasan@test.com";
        
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = new User();
            admin.setName("Super Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setProvider(AuthProvider.LOCAL);
            admin.setCreatedAt(LocalDateTime.now());
            
            userRepository.save(admin);
            System.out.println("Default Admin account created: pasan@test.com / admin123");
        }

        if (resourceRepository.count() == 0) {
            Resource r1 = Resource.builder().name("Main Auditorium").type(ResourceType.ROOM).capacity(500).location("Building A").status(ResourceStatus.ACTIVE).build();
            Resource r2 = Resource.builder().name("Mac Lab 01").type(ResourceType.LAB).capacity(40).location("Building B").status(ResourceStatus.ACTIVE).build();
            Resource r3 = Resource.builder().name("Projector 4K").type(ResourceType.EQUIPMENT).capacity(1).location("IT Store").status(ResourceStatus.ACTIVE).build();
            Resource r4 = Resource.builder().name("Meeting Room 101").type(ResourceType.ROOM).capacity(15).location("Building C").status(ResourceStatus.ACTIVE).build();
            
            resourceRepository.saveAll(java.util.Objects.requireNonNull(java.util.List.of(r1, r2, r3, r4)));
            System.out.println("Seeded 4 default institutional resources.");
        }
    }
}
