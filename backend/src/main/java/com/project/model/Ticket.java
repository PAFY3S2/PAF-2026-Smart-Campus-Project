package com.project.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;
    
    private String resourceId;
    
    private String userId;
    
    @org.springframework.data.annotation.Transient
    private User userDetails;
    
    private TicketCategory category;
    
    private String description;
    
    @Builder.Default
    private TicketPriority priority = TicketPriority.MEDIUM;
    
    @Builder.Default
    private TicketStatus status = TicketStatus.OPEN;
    
    private String technicianId;
    
    @org.springframework.data.annotation.Transient
    private User technicianDetails;
    
    @Builder.Default
    private List<String> images = new ArrayList<>();
    
    private String adminReply;
    
    private String building;
    private String lab;
    private String room;
    
    private String resolutionNotes;
    
    @Builder.Default
    private List<TicketNote> ticketNotes = new ArrayList<>();
    
    @Builder.Default
    private List<WorkLogEntry> workLog = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;

    @Builder.Default
    private List<Message> comments = new ArrayList<>();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Message {
        private String text;
        private String author;
        private String senderType; // 'user' or 'technician'
        private boolean isInternal;
        private LocalDateTime createdAt = LocalDateTime.now();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TicketNote {
        private String body;
        private String authorId;
        private LocalDateTime createdAt = LocalDateTime.now();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WorkLogEntry {
        private LocalDateTime timestamp = LocalDateTime.now();
        private String action;
        private String note;
        private String user;
    }
}
