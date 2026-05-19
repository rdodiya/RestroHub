package com.restroly.qrmenu.subscription.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionFeatureRequest {
    private String featureKey;
    private String displayName;
    private String description;
    private Boolean isActive;
}
