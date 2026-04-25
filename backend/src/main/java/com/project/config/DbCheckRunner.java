package com.project.config;

import com.project.repository.ResourceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DbCheckRunner implements CommandLineRunner {
    private final ResourceRepository repo;
    public DbCheckRunner(ResourceRepository repo) { this.repo = repo; }
    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== DB CHECK START ===");
        repo.findAll().forEach(r -> {
            System.out.println("ID: " + r.getId() + " | Name: " + r.getName() + " | ImageUrl: " + r.getImageUrl());
        });
        System.out.println("=== DB CHECK END ===");
    }
}
