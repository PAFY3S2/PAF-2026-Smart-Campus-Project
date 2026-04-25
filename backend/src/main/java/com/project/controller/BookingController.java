package com.project.controller;

import com.project.model.Booking;
import com.project.model.BookingStatus;
import com.project.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private com.project.service.NotificationService notificationService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUser(@PathVariable String userId) {
        return bookingService.getBookingsByUser(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable String id) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createBooking(
            @RequestPart(value = "booking") Booking booking,
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
            booking.setImages(imagePaths);
            
            Booking saved = bookingService.createBooking(booking);
            notificationService.notifyAdmins("New Reservation Request", 
                "A new booking for " + (saved.getResourceId() != null ? saved.getResourceId() : "a resource") + " has been submitted.", 
                com.project.model.NotificationType.BOOKING);
            return ResponseEntity.ok(saved);
        } catch (java.lang.RuntimeException | java.io.IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Booking updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        BookingStatus status = BookingStatus.valueOf(body.get("status"));
        String reason = body.get("reason");
        Booking updated = bookingService.updateBookingStatus(id, status, reason);
        String action = status == com.project.model.BookingStatus.APPROVED ? "Approved" : 
                        status == com.project.model.BookingStatus.REJECTED ? "Rejected" : "Updated";
        notificationService.notifyAdmins("Reservation " + action, 
            "Booking #" + id + " has been " + action.toLowerCase() + ".", 
            com.project.model.NotificationType.BOOKING_UPDATE);
        return updated;
    }
}
