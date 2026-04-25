package com.project.controller;

import com.project.model.Ticket;
import com.project.model.TicketPriority;
import com.project.model.TicketStatus;
import com.project.security.UserPrincipal;
import com.project.service.TicketService;
import com.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/technician")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('TECHNICIAN')")
public class TechnicianController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private UserService userService;

    @GetMapping("/dashboard/stats")
    public Map<String, Long> getStats(Authentication auth) {
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        return ticketService.getTechnicianStats(userPrincipal.getId());
    }

    @GetMapping("/active-assignments")
    public List<Ticket> getActiveAssignments(Authentication auth) {
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        return ticketService.getTicketsByTechnician(userPrincipal.getId()).stream()
                .filter(t -> t.getStatus() == TicketStatus.OPEN || t.getStatus() == TicketStatus.IN_PROGRESS)
                .collect(Collectors.toList());
    }

    @GetMapping("/in-progress")
    public List<Ticket> getInProgress(Authentication auth) {
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        return ticketService.getTicketsByTechnician(userPrincipal.getId()).stream()
                .filter(t -> t.getStatus() == TicketStatus.IN_PROGRESS)
                .collect(Collectors.toList());
    }

    @GetMapping("/resolved")
    public List<Ticket> getResolved(Authentication auth) {
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        return ticketService.getTicketsByTechnician(userPrincipal.getId()).stream()
                .filter(t -> t.getStatus() == TicketStatus.RESOLVED)
                .collect(Collectors.toList());
    }

    @GetMapping("/priority")
    public List<Ticket> getPriority() {
        return ticketService.getAllTickets().stream()
                .sorted((a, b) -> {
                    if (a.getUpdatedAt() != null && b.getUpdatedAt() != null) {
                        return b.getUpdatedAt().compareTo(a.getUpdatedAt());
                    }
                    return 0;
                })
                .collect(Collectors.toList());
    }

    private int getPriorityValue(TicketPriority priority) {
        if (priority == null) return 0;
        switch (priority) {
            case URGENT: return 4;
            case HIGH: return 3;
            case MEDIUM: return 2;
            case LOW: return 1;
            default: return 0;
        }
    }

    @GetMapping("/closed")
    public List<Ticket> getClosed(Authentication auth) {
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        return ticketService.getTicketsByTechnician(userPrincipal.getId()).stream()
                .filter(t -> t.getStatus() == TicketStatus.CLOSED)
                .collect(Collectors.toList());
    }

    @PostMapping("/tickets/{id}/notes")
    public Ticket addNote(@PathVariable String id, @RequestBody Map<String, String> body, Authentication auth) {
        String note = body.get("note");
        return ticketService.addNote(id, note, auth.getName());
    }

    @GetMapping("/tickets/{id}/notes")
    public List<Ticket.TicketNote> getNotes(@PathVariable String id) {
        return ticketService.getTicketById(id)
                .map(Ticket::getTicketNotes)
                .orElse(List.of());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> updates, Authentication auth) {
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        return ResponseEntity.ok(userService.updateProfile(userPrincipal.getId(), updates));
    }
}
