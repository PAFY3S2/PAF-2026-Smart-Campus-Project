package com.project.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;
    
    private String userId; // The ID of the User this notification belongs to
    
    private String title;
    
    private String message;
    
    private NotificationType type;
    
    private boolean isRead;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
