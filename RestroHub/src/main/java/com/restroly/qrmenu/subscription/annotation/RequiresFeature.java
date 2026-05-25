package com.restroly.qrmenu.subscription.annotation;

import com.restroly.qrmenu.subscription.enums.FeatureType;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequiresFeature {
    FeatureType value();
    String restaurantIdParam() default "restId";
}