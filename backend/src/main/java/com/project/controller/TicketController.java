package com.project.controller;

import com.project.model.Ticket;
import com.project.model.TicketStatus;
import com.project.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private com.project.service.NotificationService notificationService;

    @GetMapping
    public List<Ticket> getAllTickets(@RequestParam(required = false) String userId, 
                                      @RequestParam(required = false) String technicianId) {
        if (userId != null) return ticketService.getTicketsByUser(userId);
        if (technicianId != null) return ticketService.getTicketsByTechnician(technicianId);
        return ticketService.getAllTickets();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable String id) {
        return ticketService.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createTicket(
            @RequestPart(value = "ticket") Ticket ticket,
            @RequestPart(value = "images", required = false) org.springframework.web.multipart.MultipartFile[] images) {
        try {
            java.util.List<String> imagePaths = new java.util.ArrayList<>();
            if (images != null && images.length > 0) {
                String uploadDirStr = "uploads/";
                java.io.File uploadDir = new java.io.File(uploadDirStr);
                if (!uploadDir.exists()) uploadDir.mkdirs();
                
                for (org.springframework.web.multipart.MultipartFile file : images) {
                    if (file.isEmpty()) continue;
                    String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename().replaceAll("[^a-zA-Z0-9.-]", "_");
                    java.nio.file.Path path = java.nio.file.Paths.get(uploadDirStr + filename);
                    java.nio.file.Files.write(path, file.getBytes());
                    imagePaths.add("/uploads/" + filename);
                }
            }
            ticket.setImages(imagePaths);
            Ticket saved = ticketService.createTicket(ticket);
            notificationService.notifyAdmins("New Incident Report", 
                "A new ticket for category '" + saved.getCategory() + "' has been filed.", 
                com.project.model.NotificationType.TICKET);
            return ResponseEntity.ok(saved);
        } catch (java.lang.RuntimeException | java.io.IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public Ticket updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        TicketStatus status = TicketStatus.valueOf(body.get("status"));
        String notes = body.get("notes");
        Ticket updated = ticketService.updateTicketStatus(id, status, notes);
        notificationService.notifyAdmins("Incident Status Updated", 
            "Ticket #" + id + " status changed to " + status, 
            com.project.model.NotificationType.TICKET_UPDATE);
        return updated;
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TECHNICIAN')")
    public Ticket assignTechnician(@PathVariable String id, @RequestBody Map<String, String> body) {
        String technicianId = body.get("technicianId");
        Ticket updated = ticketService.assignTechnician(id, technicianId);
        notificationService.notifyAdmins("Technician Assigned", 
            "A technician has been assigned to Incident #" + id, 
            com.project.model.NotificationType.TICKET_UPDATE);
        return updated;
    }

    @GetMapping("/{id}/evidence")
    public List<String> getEvidence(@PathVariable String id) {
        return ticketService.getEvidence(id);
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<?> addMessage(@PathVariable String id, @RequestBody Map<String, String> body, Authentication auth) {
        String content = body.get("content");
        String senderType = body.getOrDefault("senderType", "user");
        String authorName = auth != null ? auth.getName() : "Unknown User";
        Ticket response = ticketService.addMessage(id, content, senderType, authorName);
        notificationService.notifyAdmins("Ticket Response Hub", 
            "A new response has been added to Ticket #" + id, 
            com.project.model.NotificationType.TICKET_UPDATE);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/notes")
    public Ticket addNote(@PathVariable String id, @RequestBody Map<String, String> body, Authentication auth) {
        String content = body.get("content");
        String authorName = auth != null ? auth.getName() : "Unknown Technician";
        return ticketService.addNote(id, content, authorName);
    }
}
