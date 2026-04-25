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
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;
    
    private String resourceId;
    
    private String userId;
    
    private String date; // YYYY-MM-DD
    
    private String startTime; // HH:mm
    
    private String endTime; // HH:mm
    
    private String purpose;
    
    private Integer attendees;
    
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;
    
    private String rejectionReason;

    private List<String> images;

    @CreatedDate
    private LocalDateTime createdAt;
}
