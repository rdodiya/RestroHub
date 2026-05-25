package com.restroly.qrmenu.subscription.service;

import com.restroly.qrmenu.subscription.entity.RestaurantSubscription;
import com.restroly.qrmenu.subscription.enums.FeatureType;
import com.restroly.qrmenu.subscription.exception.FeatureAccessException;
import com.restroly.qrmenu.subscription.repository.RestaurantSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionValidationService {

    private final RestaurantSubscriptionRepository subscriptionRepository;

    public void validateFeatureAccess(Long restId, FeatureType feature) {
        Optional<RestaurantSubscription> subscriptionOpt =
                subscriptionRepository.findByRestIdAndActiveTrueAndEndDateAfter(
                        restId, LocalDateTime.now()
                );

        if (subscriptionOpt.isEmpty()) {
            log.warn("No active subscription found for restaurantId={}", restId);
            throw new FeatureAccessException(feature, "No active subscription found.");
        }

        RestaurantSubscription subscription = subscriptionOpt.get();


        if (feature == FeatureType.ADD_BRANCH && subscription.getPlan().getMaxBranches() > 0) {
            return;
        }


        if (!subscription.getPlan().getAllowedFeatures().contains(feature)) {
            log.warn("Feature {} not allowed for restaurantId={}, plan={}",
                    feature, restId, subscription.getPlan().getType());
            throw new FeatureAccessException(feature);
        }
    }
    public void validateBranchLimit(Long restaurantId, int currentBranchCount) {
        Optional<RestaurantSubscription> subscriptionOpt =
                subscriptionRepository.findByRestIdAndActiveTrueAndEndDateAfter(
                        restaurantId, LocalDateTime.now()
                );

        if (subscriptionOpt.isEmpty()) {
            throw new FeatureAccessException(FeatureType.ADD_BRANCH, "No active subscription found.");
        }

        int maxBranches = subscriptionOpt.get().getPlan().getMaxBranches();

        if (currentBranchCount >= maxBranches) {
            throw new FeatureAccessException(
                    FeatureType.ADD_BRANCH,
                    String.format("Branch limit of %d reached for your current plan.", maxBranches)
            );
        }
    }
}
