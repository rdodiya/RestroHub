package com.restroly.qrmenu.mailSevice.service;


import com.restroly.qrmenu.mailSevice.dto.EmailDetails;

public interface EmailService {

    // Method to send simple email
    String sendSimpleMail(EmailDetails details);
}
