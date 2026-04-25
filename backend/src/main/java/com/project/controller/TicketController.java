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

    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    @PatchMapping("/{id}/status")
    public Ticket updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        TicketStatus status = TicketStatus.valueOf(body.get("status"));
        String notes = body.get("notes");
        return ticketService.updateTicketStatus(id, status, notes);
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TECHNICIAN')")
    public Ticket assignTechnician(@PathVariable String id, @RequestBody Map<String, String> body) {
        String technicianId = body.get("technicianId");
        return ticketService.assignTechnician(id, technicianId);
    }

    @GetMapping("/{id}/evidence")
    public List<String> getEvidence(@PathVariable String id) {
        return ticketService.getEvidence(id);
    }

    @PostMapping("/{id}/messages")
    public Ticket addMessage(@PathVariable String id, @RequestBody Map<String, String> body, Authentication auth) {
        String content = body.get("content");
        String senderType = body.getOrDefault("senderType", "user");
        String authorName = auth != null ? auth.getName() : "Unknown User";
        return ticketService.addMessage(id, content, senderType, authorName);
    }

    @PostMapping("/{id}/notes")
    public Ticket addNote(@PathVariable String id, @RequestBody Map<String, String> body, Authentication auth) {
        String content = body.get("content");
        String authorName = auth != null ? auth.getName() : "Unknown Technician";
        return ticketService.addNote(id, content, authorName);
    }
}
