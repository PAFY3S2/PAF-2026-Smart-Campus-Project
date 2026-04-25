package com.project.controller;

import com.project.model.Resource;
import com.project.model.ResourceStatus;
import com.project.model.ResourceType;
import com.project.service.ResourceService;
import com.project.service.FileStorageService;
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
@CrossOrigin(origins = "*")
public class ResourceController {

    private final ResourceService resourceService;
    private final FileStorageService fileStorageService;

    public ResourceController(ResourceService resourceService, FileStorageService fileStorageService) {
        this.resourceService = resourceService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping
    public List<Resource> getAllResources(@RequestParam(required = false) ResourceType type) {
        if (type != null) {
            return resourceService.getResourcesByType(type);
        }
        return resourceService.getAllResources();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable String id) {
        return resourceService.getResourceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> createResource(
            @ModelAttribute Resource resource,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        if (image != null && !image.isEmpty()) {
            String imageUrl = fileStorageService.storeFile(image);
            resource.setImageUrl(imageUrl);
        }
        return new ResponseEntity<>(resourceService.createOrUpdateResource(resource), HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> updateResource(
            @PathVariable String id,
            @ModelAttribute Resource resourceDetails,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "removeImage", defaultValue = "false") boolean removeImage
    ) {
        Resource existing = resourceService.getResourceById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        resourceDetails.setId(id);

        if (removeImage) {
            if (existing.getImageUrl() != null) {
                fileStorageService.deleteFile(existing.getImageUrl());
            }
            resourceDetails.setImageUrl(null);
        } else if (image != null && !image.isEmpty()) {
            if (existing.getImageUrl() != null) {
                fileStorageService.deleteFile(existing.getImageUrl());
            }
            String imageUrl = fileStorageService.storeFile(image);
            resourceDetails.setImageUrl(imageUrl);
        } else {
            resourceDetails.setImageUrl(existing.getImageUrl());
        }

        return ResponseEntity.ok(resourceService.updateResource(id, resourceDetails));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        Resource existing = resourceService.getResourceById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        
        if (existing.getImageUrl() != null) {
            fileStorageService.deleteFile(existing.getImageUrl());
        }
        
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> updateResourceStatus(@PathVariable String id, @RequestBody Map<String, String> updates) {
        String statusStr = updates.get("status");
        Resource resource = resourceService.getResourceById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        
        resource.setStatus(ResourceStatus.valueOf(statusStr.toUpperCase()));
        return ResponseEntity.ok(resourceService.createOrUpdateResource(resource));
    }
}
