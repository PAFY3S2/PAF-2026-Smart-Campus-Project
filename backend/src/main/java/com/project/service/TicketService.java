package com.project.service;

import com.project.model.*;
import com.project.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(this::populateDetails)
                .collect(java.util.stream.Collectors.toList());
    }

    public List<Ticket> getTicketsByUser(String userId) {
        return ticketRepository.findByUserId(userId).stream()
                .map(this::populateDetails)
                .collect(java.util.stream.Collectors.toList());
    }

    public List<Ticket> getTicketsByTechnician(String technicianId) {
        return ticketRepository.findByTechnicianId(technicianId).stream()
                .map(this::populateDetails)
                .collect(java.util.stream.Collectors.toList());
    }

    public Optional<Ticket> getTicketById(String id) {
        return ticketRepository.findById(id).map(this::populateDetails);
    }

    private Ticket populateDetails(Ticket ticket) {
        if (ticket.getUserId() != null) {
            userService.getUserById(ticket.getUserId()).ifPresent(ticket::setUserDetails);
        }
        if (ticket.getTechnicianId() != null) {
            userService.getUserById(ticket.getTechnicianId()).ifPresent(ticket::setTechnicianDetails);
        }
        return ticket;
    }

    public Ticket createTicket(Ticket ticket) {
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        Ticket saved = ticketRepository.save(ticket);
        
        // Notify student of submission
        Notification notification = Notification.builder()
                .userId(saved.getUserId())
                .title("Ticket Created")
                .message("Your incident report for " + saved.getCategory() + " has been logged. Technical staff will review it shortly.")
                .type(NotificationType.TICKET)
                .build();
        notificationService.createNotification(notification);
        
        return saved;
    }

    public Ticket updateTicketStatus(String id, TicketStatus status, String notes) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        ticket.setStatus(status);
        if (notes != null) ticket.setResolutionNotes(notes);
        ticket.setUpdatedAt(LocalDateTime.now());
        
        Ticket saved = ticketRepository.save(ticket);

        // Notify user
        Notification notification = Notification.builder()
                .userId(ticket.getUserId())
                .title("Ticket Update")
                .message("Your ticket status is now " + status)
                .type(NotificationType.TICKET_UPDATE)
                .build();
        notificationService.createNotification(notification);

        return saved;
    }

    public Ticket assignTechnician(String id, String technicianId) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        ticket.setTechnicianId(technicianId);
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        ticket.setUpdatedAt(LocalDateTime.now());
        
        Ticket saved = ticketRepository.save(ticket);

        // Notify technician
        Notification techNotification = Notification.builder()
                .userId(technicianId)
                .title("New Assignment")
                .message("You have been assigned a new ticket: " + ticket.getDescription())
                .type(NotificationType.TICKET_UPDATE)
                .build();
        notificationService.createNotification(techNotification);

        return saved;
    }

    public List<String> getEvidence(String ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        return ticket.getImages() != null ? ticket.getImages() : List.of();
    }

    public Ticket addMessage(String ticketId, String content, String senderType, String authorName) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        Ticket.Message message = new Ticket.Message();
        message.setText(content);
        message.setSenderType(senderType);
        message.setAuthor(authorName);
        message.setInternal(false);
        message.setCreatedAt(LocalDateTime.now());
        
        ticket.getComments().add(message);
        ticket.setUpdatedAt(LocalDateTime.now());
        
        Ticket saved = ticketRepository.save(ticket);

        // Send notification to the other party
        String targetUserId = "user".equals(senderType) ? ticket.getTechnicianId() : ticket.getUserId();
        if (targetUserId != null) {
            Notification notification = Notification.builder()
                    .userId(targetUserId)
                    .title("New Ticket Message")
                    .message("New message from " + authorName + " on ticket: " + ticket.getDescription())
                    .type(NotificationType.TICKET_UPDATE)
                    .build();
            notificationService.createNotification(notification);
        }

        return saved;
    }

    public Ticket addNote(String ticketId, String content, String authorName) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        Ticket.Message message = new Ticket.Message();
        message.setText(content);
        message.setSenderType("technician");
        message.setAuthor(authorName);
        message.setInternal(true);
        message.setCreatedAt(LocalDateTime.now());
        
        ticket.getComments().add(message);
        ticket.setUpdatedAt(LocalDateTime.now());
        
        return ticketRepository.save(ticket);
    }

    public java.util.Map<String, Long> getTechnicianStats(String technicianId) {
        long assignedCount = ticketRepository.countByTechnicianIdAndStatusIn(
                technicianId, 
                java.util.List.of(TicketStatus.OPEN, TicketStatus.IN_PROGRESS)
        );
        long inProgressCount = ticketRepository.countByTechnicianIdAndStatus(technicianId, TicketStatus.IN_PROGRESS);
        long resolvedCount = ticketRepository.countByTechnicianIdAndStatus(technicianId, TicketStatus.RESOLVED);
        long priorityCount = ticketRepository.countByTechnicianIdAndPriorityInAndStatusNot(
                technicianId,
                java.util.List.of(TicketPriority.HIGH, TicketPriority.URGENT),
                TicketStatus.CLOSED
        );

        return java.util.Map.of(
            "assignedCount", assignedCount,
            "inProgressCount", inProgressCount,
            "resolvedCount", resolvedCount,
            "priorityCount", priorityCount
        );
    }
}
