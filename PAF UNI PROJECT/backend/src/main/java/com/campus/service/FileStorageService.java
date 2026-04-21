package com.campus.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    // Store outside the src tree statically for persistence
    private final Path fileStorageLocation;

    public FileStorageService() {
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        // Generate unique name to prevent collisions securely
        String originalFileName = file.getOriginalFilename();
        String extension = "";
        
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        
        String fileName = UUID.randomUUID().toString() + extension;

        try {
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            // Replace existing files locally without crash
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.trim().isEmpty()) {
            return;
        }
        
        try {
            // Unpack URL path prefix cleanly extracting filename
            String fileName = fileUrl;
            if (fileUrl.startsWith("/uploads/")) {
                fileName = fileUrl.substring("/uploads/".length());
            }
            
            Path targetLocation = this.fileStorageLocation.resolve(fileName).normalize();
            
            // Critical: Ensure targetLocation remains inside our intended directory isolating Directory Traversal defects.
            if (!targetLocation.getParent().equals(this.fileStorageLocation)) {
                System.err.println("Cannot delete file outside storage directory.");
                return;
            }
            
            Files.deleteIfExists(targetLocation);
        } catch (IOException ex) {
            System.err.println("Could not delete file " + fileUrl + ". Error: " + ex.getMessage());
        }
    }
}
