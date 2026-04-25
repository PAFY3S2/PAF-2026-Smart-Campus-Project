package com.project.service;

import com.project.model.*;
import com.project.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private NotificationService notificationService;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByUser(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Optional<Booking> getBookingById(String id) {
        return bookingRepository.findById(id);
    }

    public Booking createBooking(Booking booking) {
        if (hasConflict(booking)) {
            throw new RuntimeException("Overlapping booking exists for this resource at the requested time.");
        }
        Booking saved = bookingRepository.save(booking);
        
        // Notify student of submission
        Notification notification = Notification.builder()
                .userId(saved.getUserId())
                .title("Booking Submitted")
                .message("Your booking request for " + saved.getDate() + " has been received and is awaiting review.")
                .type(NotificationType.BOOKING)
                .build();
        notificationService.createNotification(notification);
        
        return saved;
    }

    public boolean hasConflict(Booking newBooking) {
        System.out.println("Checking conflict for resource: " + newBooking.getResourceId() + " on " + newBooking.getDate());
        
        // Find all bookings for this resource on this date
        List<Booking> existingBookings = bookingRepository.findByResourceIdAndDate(
                newBooking.getResourceId(), 
                newBooking.getDate()
        );

        System.out.println("Found " + existingBookings.size() + " existing bookings for this resource/date");

        LocalTime newStart = LocalTime.parse(newBooking.getStartTime());
        LocalTime newEnd = LocalTime.parse(newBooking.getEndTime());

        for (Booking existing : existingBookings) {
            System.out.println("Checking against existing booking: " + existing.getId() + " [" + existing.getStartTime() + " - " + existing.getEndTime() + "] Status: " + existing.getStatus());
            
            // Skip if it's the same booking (for updates)
            if (newBooking.getId() != null && newBooking.getId().equals(existing.getId())) {
                continue;
            }
            
            // Skip rejected or cancelled bookings
            if (existing.getStatus() == BookingStatus.REJECTED || existing.getStatus() == BookingStatus.CANCELLED) {
                continue;
            }

            LocalTime extStart = LocalTime.parse(existing.getStartTime());
            LocalTime extEnd = LocalTime.parse(existing.getEndTime());

            // Conflict condition: (StartA < EndB) and (EndA > StartB)
            if (newStart.isBefore(extEnd) && newEnd.isAfter(extStart)) {
                System.out.println("CONFLICT DETECTED!");
                return true;
            }
        }
        System.out.println("No conflict detected.");
        return false;
    }

    public Booking updateBookingStatus(String id, BookingStatus status, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(status);
        if (reason != null) booking.setStatusReason(reason);
        
        Booking saved = bookingRepository.save(booking);

        Notification notification = Notification.builder()
                .userId(booking.getUserId())
                .title("Booking Update")
                .message("Your booking for " + booking.getDate() + " is now " + status)
                .type(NotificationType.BOOKING_UPDATE)
                .build();
        notificationService.createNotification(notification);

        return saved;
    }
}
