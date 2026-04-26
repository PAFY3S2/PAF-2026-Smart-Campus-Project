package com.project.service;

import com.project.model.Notification;
import com.project.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private com.project.repository.UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void notifyAdmins(String title, String message, com.project.model.NotificationType type) {
        List<com.project.model.User> admins = userRepository.findAll().stream()
                .filter(u -> u.getRole() == com.project.model.Role.ADMIN)
                .collect(java.util.stream.Collectors.toList());

        for (com.project.model.User admin : admins) {
            Notification notification = Notification.builder()
                    .userId(admin.getId())
                    .title(title)
                    .message(message)
                    .type(type)
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();
            createNotification(notification);
        }
    }

    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadUserNotifications(String userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    public Notification createNotification(Notification notification) {
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        Notification savedNotification = notificationRepository.save(notification);

        // Broadcast to WebSocket topic
        messagingTemplate.convertAndSendToUser(
                savedNotification.getUserId(),
                "/queue/notifications",
                savedNotification
        );

        return savedNotification;
    }

    public Optional<Notification> markAsRead(String id, String userId) {
        Optional<Notification> optionalNotification = notificationRepository.findById(id);
        
        if (optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();
            // Verify notification belongs to the user
            if (notification.getUserId().equals(userId)) {
                notification.setRead(true);
                return Optional.of(notificationRepository.save(notification));
            }
        }
        
        return Optional.empty();
    }

    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        for (Notification notification : unread) {
            notification.setRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    public boolean deleteNotification(String id, String userId) {
        Optional<Notification> optionalNotification = notificationRepository.findById(id);
        
        if (optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();
            if (notification.getUserId().equals(userId)) {
                notificationRepository.delete(notification);
                return true;
            }
        }
        return false;
    }
}
