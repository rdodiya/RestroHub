package com.restroly.qrmenu.subscription.controller;

import com.restroly.qrmenu.subscription.dto.SubscriptionStatusResponse;
import com.restroly.qrmenu.subscription.entity.RestaurantSubscription;
import com.restroly.qrmenu.subscription.entity.SubscriptionPlan;
import com.restroly.qrmenu.subscription.enums.SubscriptionType;
import com.restroly.qrmenu.subscription.repository.RestaurantSubscriptionRepository;
import com.restroly.qrmenu.subscription.repository.SubscriptionPlanRepository;
import com.restroly.qrmenu.common.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import static com.restroly.qrmenu.common.util.ApiConstants.SECURE_API_VERSION;

@RestController
@RequestMapping(SECURE_API_VERSION + "/restaurants/{restId}/subscription")
@RequiredArgsConstructor
public class SubscriptionManagementController {

    private final RestaurantSubscriptionRepository subscriptionRepository;
    private final SubscriptionPlanRepository planRepository;

    // --- GET CURRENT PLAN ---
    @GetMapping
    public ResponseEntity<SubscriptionStatusResponse> getActiveSubscriptionState(@PathVariable Long restId) {
        return subscriptionRepository.findByRestIdAndActiveTrueAndEndDateAfter(restId, LocalDateTime.now())
                .map(sub -> SubscriptionStatusResponse.builder()
                        .restId(restId)
                        .planType(sub.getPlan().getType())
                        .planName(sub.getPlan().getName())
                        .expiresAt(sub.getEndDate())
                        .active(true)
                        .maxBranches(sub.getPlan().getMaxBranches())
                        .allowedFeatures(sub.getPlan().getAllowedFeatures())
                        .build())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- CHANGE PLAN (UPGRADE/DOWNGRADE) ---
    @PutMapping("/change")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> transitionAccountTier(
            @PathVariable Long restId,
            @RequestParam SubscriptionType targetTier) {

        // 1. Find the target plan
        SubscriptionPlan targetPlan = planRepository.findByTypeAndActiveTrue(targetTier)
                .orElseThrow(() -> new ResourceNotFoundException("Target plan not found: " + targetTier));

        // Variable to hold our dynamic success message
        String actionMessage = "subscribed";

        // 2. Find Current Plan & Check for Upgrade vs Downgrade
        Optional<RestaurantSubscription> currentSubOpt = subscriptionRepository
                .findByRestIdAndActiveTrueAndEndDateAfter(restId, LocalDateTime.now());

        if (currentSubOpt.isPresent()) {
            RestaurantSubscription currentLease = currentSubOpt.get();
            SubscriptionType currentTier = currentLease.getPlan().getType();

            // Duplicate Check
            if (currentTier == targetTier) {
                return ResponseEntity.badRequest().body(Map.of("message", "Already on " + targetTier.name() + " plan!"));
            }

            // Determine Upgrade or Downgrade based on Enum position
            if (targetTier.ordinal() > currentTier.ordinal()) {
                actionMessage = "upgraded";
            } else {
                actionMessage = "downgraded";
            }

            // Deactivate old plan
            currentLease.setActive(false);
            subscriptionRepository.save(currentLease);
        }

        // 3. Save new plan
        RestaurantSubscription newSubscription = RestaurantSubscription.builder()
                .restId(restId)
                .plan(targetPlan)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusYears(1))
                .active(true)
                .build();

        subscriptionRepository.save(newSubscription);

        // 4. Return dynamic message
        return ResponseEntity.ok(Map.of("message", "Successfully " + actionMessage + " to " + targetTier.name()));
    }
}