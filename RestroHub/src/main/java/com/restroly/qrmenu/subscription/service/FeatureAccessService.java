package com.restroly.qrmenu.subscription.service;

import com.restroly.qrmenu.subscription.entity.RestaurantSubscription;
import com.restroly.qrmenu.subscription.enums.FeatureType;
import com.restroly.qrmenu.subscription.exception.FeatureAccessException;
import com.restroly.qrmenu.subscription.repository.RestaurantSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FeatureAccessService {

    private final RestaurantSubscriptionRepository subscriptionRepository;

    public boolean hasFeatureAccess(Long restId, FeatureType feature) {
        Optional<RestaurantSubscription> subscription =
                subscriptionRepository.findByRestIdAndActiveTrueAndEndDateAfter(
                        restId, LocalDateTime.now()
                );

        return subscription
                .map(sub -> {

                    if (feature == FeatureType.ADD_BRANCH && sub.getPlan().getMaxBranches() > 0) {
                        return true;
                    }


                    return sub.getPlan().getAllowedFeatures().contains(feature);
                })
                .orElse(false);
    }

    public void assertFeatureAccess(Long restId, FeatureType feature) {
        if (!hasFeatureAccess(restId, feature)) {
            throw new FeatureAccessException(feature);
        }
    }

    public boolean canUseWhatsApp(Long restId) {
        return hasFeatureAccess(restId, FeatureType.WHATSAPP_NOTIFICATION);
    }

    public boolean canUseAiTranslation(Long restId) {
        return hasFeatureAccess(restId, FeatureType.AI_TRANSLATION);
    }

    public boolean canAddBranch(Long restId) {
        return hasFeatureAccess(restId, FeatureType.ADD_BRANCH);
    }

    public boolean canUseCustomDomain(Long restId) {
        return hasFeatureAccess(restId, FeatureType.CUSTOM_DOMAIN);
    }

    public boolean canUseWebsiteTemplate(Long restId) {
        return hasFeatureAccess(restId, FeatureType.WEBSITE_TEMPLATE);
    }
    public void validateBranchLimit(Long restId, int currentBranchCount) {
        Optional<RestaurantSubscription> sub = subscriptionRepository.findByRestIdAndActiveTrueAndEndDateAfter(restId, LocalDateTime.now());

        if (sub.isPresent()) {
            int limit = sub.get().getPlan().getMaxBranches();
            if (currentBranchCount >= limit) {
                throw new FeatureAccessException(FeatureType.ADD_BRANCH);
            }
        } else {
            throw new FeatureAccessException(FeatureType.ADD_BRANCH);
        }
    }
}