package com.campus.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DummyController {

    @GetMapping("/notifications")
    public ResponseEntity<List<Object>> getNotifications() {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<Map<String, Object>>> getBookings() {
        // Return dummy bookings with dates for the past week to populate the trend chart
        List<Map<String, Object>> mockBookings = new ArrayList<>();
        
        java.time.LocalDate today = java.time.LocalDate.now();
        mockBookings.add(Map.of("id", 1, "date", today.toString()));
        mockBookings.add(Map.of("id", 2, "date", today.toString()));
        mockBookings.add(Map.of("id", 3, "date", today.minusDays(1).toString()));
        mockBookings.add(Map.of("id", 4, "date", today.minusDays(2).toString()));
        mockBookings.add(Map.of("id", 5, "date", today.minusDays(2).toString()));
        mockBookings.add(Map.of("id", 6, "date", today.minusDays(4).toString()));
        mockBookings.add(Map.of("id", 7, "date", today.minusDays(5).toString()));

        return ResponseEntity.ok(mockBookings);
    }

    @GetMapping("/tickets")
    public ResponseEntity<List<Map<String, Object>>> getTickets() {
        // Return dummy active tickets
        List<Map<String, Object>> mockTickets = new ArrayList<>();
        mockTickets.add(Map.of("id", 101, "status", "OPEN"));
        mockTickets.add(Map.of("id", 102, "status", "IN_PROGRESS"));
        mockTickets.add(Map.of("id", 103, "status", "OPEN"));

        return ResponseEntity.ok(mockTickets);
    }
}
