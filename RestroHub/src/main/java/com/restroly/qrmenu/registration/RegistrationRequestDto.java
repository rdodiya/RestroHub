package com.restroly.qrmenu.registration;

import java.time.LocalDateTime;

public record RegistrationRequestDto(
    Long id,
    Long userId,
    String name,
    String email,
    String requestedRestaurant,
    Long restaurantId,
    boolean newRestaurant,
    RegistrationStatus status,
    LocalDateTime createdAt) {}
