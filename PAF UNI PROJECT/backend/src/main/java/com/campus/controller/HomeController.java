package com.campus.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Smart Campus Backend API is currently running. Use the React Dashboard on port 5173 to interact with the system.";
    }
}
