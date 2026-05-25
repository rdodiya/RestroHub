package com.restroly.qrmenu.subscription.exception;

import com.restroly.qrmenu.subscription.enums.FeatureType;
import lombok.Getter;

@Getter
public class FeatureAccessException extends RuntimeException {

    private final FeatureType feature;
    private final String reason;

    public FeatureAccessException(FeatureType feature) {
        super("Your current subscription does not support this feature: " + feature.name());
        this.feature = feature;
        this.reason = "Your current subscription does not support this feature.";
    }

    public FeatureAccessException(FeatureType feature, String reason) {
        super(reason);
        this.feature = feature;
        this.reason = reason;
    }
}