package com.restroly.qrmenu.subscription.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanFeatureMappingDto {
    private Long id;
    private Long featureId;
    private String featureKey;
    private String featureValue;
}
