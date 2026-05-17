package com.restroly.qrmenu.subscription.service;

import com.restroly.qrmenu.subscription.dto.RestaurantSubscriptionDto;
import com.restroly.qrmenu.subscription.dto.RestaurantSubscriptionRequest;
import com.restroly.qrmenu.subscription.dto.SubscriptionPlanDto;
import com.restroly.qrmenu.subscription.dto.SubscriptionPlanRequest;

import java.util.List;

public interface SubscriptionService {
    SubscriptionPlanDto createPlan(SubscriptionPlanRequest request);
    SubscriptionPlanDto updatePlan(Long planId, SubscriptionPlanRequest request);
    void deletePlan(Long planId);
    List<SubscriptionPlanDto> getAllPlans();
    SubscriptionPlanDto getPlanById(Long planId);

    RestaurantSubscriptionDto assignPlanToRestaurant(Long restaurantId, RestaurantSubscriptionRequest request);
    RestaurantSubscriptionDto getRestaurantSubscription(Long restaurantId);
    boolean isFeatureEnabled(Long restaurantId, String featureKey);
}
