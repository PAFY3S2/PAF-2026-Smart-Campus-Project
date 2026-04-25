package com.project.controller;

import com.project.model.Resource;
import com.project.model.ResourceStatus;
import com.project.model.ResourceType;
import com.project.model.NotificationType;
import com.project.service.ResourceService;
import com.project.service.FileStorageService;
import com.project.service.NotificationService;
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
    private final NotificationService notificationService;

    public ResourceController(ResourceService resourceService, FileStorageService fileStorageService, NotificationService notificationService) {
        this.resourceService = resourceService;
        this.fileStorageService = fileStorageService;
        this.notificationService = notificationService;
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
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        if (image != null && !image.isEmpty()) {
            String fileName = fileStorageService.storeFile(image);
            resource.setImageUrl("/uploads/" + fileName);
        }
        Resource saved = resourceService.createOrUpdateResource(resource);
        notificationService.notifyAdmins("New Resource Created", 
            "Resource '" + saved.getName() + "' has been added to the system.", 
            NotificationType.RESOURCE_OPS);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> updateResource(
            @PathVariable String id,
            @ModelAttribute Resource resourceDetails,
            @RequestParam(value = "image", required = false) MultipartFile image,
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
            String fileName = fileStorageService.storeFile(image);
            resourceDetails.setImageUrl("/uploads/" + fileName);
        } else {
            resourceDetails.setImageUrl(existing.getImageUrl());
        }

        Resource updated = resourceService.updateResource(id, resourceDetails);
        notificationService.notifyAdmins("Resource Updated", 
            "Resource '" + updated.getName() + "' has been updated.", 
            NotificationType.RESOURCE_OPS);
        return ResponseEntity.ok(updated);
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
        notificationService.notifyAdmins("Resource Deleted", 
            "Resource '" + existing.getName() + "' has been removed.", 
            NotificationType.RESOURCE_OPS);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> updateResourceStatus(@PathVariable String id, @RequestBody Map<String, String> updates) {
        String statusStr = updates.get("status");
        Resource resource = resourceService.getResourceById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        
        resource.setStatus(ResourceStatus.valueOf(statusStr.toUpperCase()));
        Resource updated = resourceService.createOrUpdateResource(resource);
        notificationService.notifyAdmins("Resource Status Changed", 
            "Resource '" + updated.getName() + "' status changed to " + statusStr, 
            NotificationType.RESOURCE_OPS);
        return ResponseEntity.ok(updated);
    }
}
