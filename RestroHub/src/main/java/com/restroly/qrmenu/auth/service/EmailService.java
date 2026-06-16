package com.restroly.qrmenu.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String mailUsername;

    public void sendResetEmail(String toEmail, String token) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailUsername);
        message.setTo(toEmail);
        message.setSubject("Password Reset Request");

        message.setText(
            "Click the link below to reset your password:\n\n"
            + "https://example.com/reset-password?token="
            + token
        );

        mailSender.send(message);

        System.out.println("Reset email sent successfully");
    }
}