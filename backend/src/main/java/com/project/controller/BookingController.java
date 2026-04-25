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
            @RequestPart(value = "booking") String bookingStr,
            @RequestPart(value = "images", required = false) org.springframework.web.multipart.MultipartFile[] images) {
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            Booking booking = mapper.readValue(bookingStr, Booking.class);

            java.util.List<String> imagePaths = new java.util.ArrayList<>();
            if (images != null && images.length > 0) {
                String uploadDirStr = "D:/MyGit/PAF main/backend/uploads/";
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
            
            return ResponseEntity.ok(bookingService.createBooking(booking));
        } catch (java.lang.RuntimeException | java.io.IOException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Booking updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        BookingStatus status = BookingStatus.valueOf(body.get("status"));
        String reason = body.get("reason");
        return bookingService.updateBookingStatus(id, status, reason);
    }
}
