package com.restroly.qrmenu.support;

import java.time.LocalDateTime;

public record SupportTicketDto(
    Long id,
    String title,
    String message,
    SupportTicketStatus status,
    String userName,
    String userEmail,
    String restaurantName,
    LocalDateTime createdAt) {}
