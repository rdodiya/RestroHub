package com.restroly.qrmenu.subscription.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantSubscriptionDto {
    private Long id;
    private Long restaurantId;
    private SubscriptionPlanDto plan;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private Boolean isAutoRenew;
}
