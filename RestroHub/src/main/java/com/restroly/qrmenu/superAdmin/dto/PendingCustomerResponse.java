package com.restroly.qrmenu.superAdmin.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PendingCustomerResponse {

    private Long userId;

    private String fullName;

    private String email;

    private String phoneNumber;

    private Boolean active;

    private Boolean locked;

    private String authProvider;

    private LocalDateTime createdAt;

    private LocalDateTime updatedDate;

    private RestaurantInfo restaurant;
}
