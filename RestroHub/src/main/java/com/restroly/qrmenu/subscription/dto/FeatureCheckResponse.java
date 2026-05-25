package com.restroly.qrmenu.subscription.dto;

import com.restroly.qrmenu.subscription.enums.FeatureType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FeatureCheckResponse {
    private Long restId;
    private FeatureType feature;
    private boolean allowed;
}