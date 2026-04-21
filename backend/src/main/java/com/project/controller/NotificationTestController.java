package com.project.controller;

import com.project.model.Notification;
import com.project.model.NotificationType;
import com.project.security.UserPrincipal;
import com.project.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test/notifications")
public class NotificationTestController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/booking")
    public ResponseEntity<?> triggerBookingNotification(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam String status) {
        
        Notification notification = Notification.builder()
                .userId(userPrincipal.getId())
                .title("Booking " + status)
                .message("Your campus facility booking has been " + status.toLowerCase() + ".")
                .type(NotificationType.BOOKING)
                .build();
        
        return ResponseEntity.ok(notificationService.createNotification(notification));
    }

    @PostMapping("/ticket")
    public ResponseEntity<?> triggerTicketNotification(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam String status) {
        
        Notification notification = Notification.builder()
                .userId(userPrincipal.getId())
                .title("Ticket Update")
                .message("Your support ticket status has changed to: " + status + ".")
                .type(NotificationType.TICKET)
                .build();
        
        return ResponseEntity.ok(notificationService.createNotification(notification));
    }

    @PostMapping("/comment")
    public ResponseEntity<?> triggerCommentNotification(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        Notification notification = Notification.builder()
                .userId(userPrincipal.getId())
                .title("New Comment")
                .message("A technician has added a new comment to your ticket.")
                .type(NotificationType.COMMENT)
                .build();
        
        return ResponseEntity.ok(notificationService.createNotification(notification));
    }
}
