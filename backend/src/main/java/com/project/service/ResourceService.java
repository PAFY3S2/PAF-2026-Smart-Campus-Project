package com.project.service;

import com.project.model.Resource;
import com.project.model.ResourceType;
import com.project.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Optional<Resource> getResourceById(String id) {
        return resourceRepository.findById(id);
    }

    public List<Resource> getResourcesByType(ResourceType type) {
        return resourceRepository.findByType(type);
    }

    public Resource createOrUpdateResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public Resource updateResource(String id, Resource details) {
        Resource existing = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        
        if (details.getName() != null) existing.setName(details.getName());
        if (details.getType() != null) existing.setType(details.getType());
        if (details.getLocation() != null) existing.setLocation(details.getLocation());
        if (details.getCapacity() != null) existing.setCapacity(details.getCapacity());
        if (details.getStatus() != null) existing.setStatus(details.getStatus());
        if (details.getAvailabilityStartTime() != null) existing.setAvailabilityStartTime(details.getAvailabilityStartTime());
        if (details.getAvailabilityEndTime() != null) existing.setAvailabilityEndTime(details.getAvailabilityEndTime());
        if (details.getImageUrl() != null || details.getImageUrl() == null) {
            // Note: We might want to allow setting it to null explicitly if removeImage is true
            // This logic is handled in the controller for now
            existing.setImageUrl(details.getImageUrl());
        }
        
        return resourceRepository.save(existing);
    }

    public void deleteResource(String id) {
        resourceRepository.deleteById(id);
    }
}
