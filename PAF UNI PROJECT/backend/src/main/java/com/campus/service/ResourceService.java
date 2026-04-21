package com.campus.service;

import com.campus.model.Resource;
import com.campus.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
    }

    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public Resource updateResource(Long id, Resource resourceDetails, boolean removeImage) {
        Resource resource = getResourceById(id);
        
        resource.setName(resourceDetails.getName());
        resource.setType(resourceDetails.getType());
        resource.setLocation(resourceDetails.getLocation());
        resource.setCapacity(resourceDetails.getCapacity());
        resource.setStatus(resourceDetails.getStatus());
        resource.setAvailabilityStartTime(resourceDetails.getAvailabilityStartTime());
        resource.setAvailabilityEndTime(resourceDetails.getAvailabilityEndTime());
        
        if (removeImage) {
            resource.setImageUrl(null);
        } else if (resourceDetails.getImageUrl() != null) {
            resource.setImageUrl(resourceDetails.getImageUrl());
        }
        
        return resourceRepository.save(resource);
    }

    public void deleteResource(Long id) {
        Resource resource = getResourceById(id);
        resourceRepository.delete(resource);
    }
    
    public Resource updateResourceStatus(Long id, String status) {
        Resource resource = getResourceById(id);
        resource.setStatus(status);
        return resourceRepository.save(resource);
    }
}
