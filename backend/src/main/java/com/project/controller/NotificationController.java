package com.project.controller;

import com.project.model.Notification;
import com.project.security.UserPrincipal;
import com.project.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userPrincipal.getId()));
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadUserNotifications(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(notificationService.getUnreadUserNotifications(userPrincipal.getId()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable String id, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Optional<Notification> updatedNotification = notificationService.markAsRead(id, userPrincipal.getId());
        
        if (updatedNotification.isPresent()) {
            return ResponseEntity.ok(updatedNotification.get());
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable String id, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean deleted = notificationService.deleteNotification(id, userPrincipal.getId());
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
