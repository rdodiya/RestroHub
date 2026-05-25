package com.restroly.qrmenu.subscription.dto;

import com.restroly.qrmenu.subscription.enums.FeatureType;
import com.restroly.qrmenu.subscription.enums.SubscriptionType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class SubscriptionStatusResponse {
    private Long restId;
    private SubscriptionType planType;
    private String planName;
    private LocalDateTime expiresAt;
    private boolean active;
    private int maxBranches;
    private Set<FeatureType> allowedFeatures;
}