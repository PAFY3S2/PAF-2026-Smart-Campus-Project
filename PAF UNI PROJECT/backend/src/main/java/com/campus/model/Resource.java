package com.campus.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is mandatory")
    private String name;

    @NotBlank(message = "Type is mandatory")
    private String type; // e.g., ROOM, LAB, EQUIPMENT

    @NotBlank(message = "Location is mandatory")
    private String location;

    @PositiveOrZero(message = "Capacity must be positive or zero")
    private Integer capacity;

    @NotBlank(message = "Status is mandatory")
    private String status; // e.g., ACTIVE, OUT_OF_SERVICE

    private String availabilityStartTime;
    private String availabilityEndTime;

    private String imageUrl;

    // Default constructor
    public Resource() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAvailabilityStartTime() { return availabilityStartTime; }
    public void setAvailabilityStartTime(String availabilityStartTime) { this.availabilityStartTime = availabilityStartTime; }

    public String getAvailabilityEndTime() { return availabilityEndTime; }
    public void setAvailabilityEndTime(String availabilityEndTime) { this.availabilityEndTime = availabilityEndTime; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
