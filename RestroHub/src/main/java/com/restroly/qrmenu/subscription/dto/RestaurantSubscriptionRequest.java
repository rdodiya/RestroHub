package com.restroly.qrmenu.subscription.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantSubscriptionRequest {
    private Long planId;
    private Boolean isAutoRenew;
    private Integer durationInMonths;
}
