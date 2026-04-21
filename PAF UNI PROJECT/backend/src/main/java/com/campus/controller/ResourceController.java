package com.campus.controller;

import com.campus.model.Resource;
import com.campus.service.ResourceService;
import com.campus.service.FileStorageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*") // Allows React frontend to access API
public class ResourceController {

    private final ResourceService resourceService;
    private final FileStorageService fileStorageService;

    public ResourceController(ResourceService resourceService, FileStorageService fileStorageService) {
        this.resourceService = resourceService;
        this.fileStorageService = fileStorageService;
    }

    // Accessible to all users
    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    // Accessible to all users
    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    // CREATE: Only accessible to ADMIN
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> createResource(
            @ModelAttribute @Valid Resource resource,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        if (image != null && !image.isEmpty()) {
            String imageUrl = fileStorageService.storeFile(image);
            resource.setImageUrl(imageUrl);
        }
        
        return new ResponseEntity<>(resourceService.createResource(resource), HttpStatus.CREATED);
    }

    // UPDATE: Only accessible to ADMIN
    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> updateResource(
            @PathVariable Long id, 
            @ModelAttribute @Valid Resource resourceDetails,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "removeImage", defaultValue = "false") boolean removeImage
    ) {
        Resource existing = resourceService.getResourceById(id);
        
        if (removeImage) {
            if (existing.getImageUrl() != null) {
                fileStorageService.deleteFile(existing.getImageUrl());
            }
            resourceDetails.setImageUrl(null);
        } else if (image != null && !image.isEmpty()) {
            if (existing.getImageUrl() != null) {
                fileStorageService.deleteFile(existing.getImageUrl()); // Delete old file natively to prevent orphans
            }
            String imageUrl = fileStorageService.storeFile(image);
            resourceDetails.setImageUrl(imageUrl);
        } else {
            // Keep existing image if no new file is pushed
            resourceDetails.setImageUrl(existing.getImageUrl());
        }
        
        return ResponseEntity.ok(resourceService.updateResource(id, resourceDetails, removeImage));
    }

    // DELETE: Only accessible to ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        Resource existing = resourceService.getResourceById(id);
        if (existing.getImageUrl() != null) {
            fileStorageService.deleteFile(existing.getImageUrl()); // Prevent physical orphans automatically
        }
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    // PATCH: Only accessible to ADMIN
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> updateResourceStatus(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        String status = updates.get("status");
        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(resourceService.updateResourceStatus(id, status));
    }
}
