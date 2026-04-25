package com.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your OTP for Smart Campus Hub Registration");
        message.setText("Dear Student,\n\n" +
                "Thank you for registering with the Smart Campus Operations Hub.\n" +
                "Your One-Time Password (OTP) for account verification is:\n\n" +
                "OTP: " + otp + "\n\n" +
                "This OTP will expire in 10 minutes. Please do not share this code with anyone.\n\n" +
                "Best regards,\n" +
                "Smart Campus Hub Team");
        
        try {
            mailSender.send(message);
            System.out.println("OTP sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("CRITICAL: Failed to send email to " + to + ". Error: " + e.getMessage());
            System.out.println("DEBUG OTP FOR DEVELOPMENT: " + otp);
            throw e; // Still throw to let the controller handle it if needed
        }
    }
}
