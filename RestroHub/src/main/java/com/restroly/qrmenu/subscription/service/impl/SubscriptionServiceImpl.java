package com.restroly.qrmenu.subscription.service.impl;

import com.restroly.qrmenu.restaurant.entity.Restaurant;
import com.restroly.qrmenu.restaurant.repository.RestaurantRepository;
import com.restroly.qrmenu.subscription.dto.*;
import com.restroly.qrmenu.subscription.entity.*;
import com.restroly.qrmenu.subscription.repository.*;
import com.restroly.qrmenu.subscription.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SubscriptionServiceImpl implements SubscriptionService {

    @Value("${subscription.status.active}")
    private String STATUS_ACTIVE;

    @Value("${subscription.status.cancelled}")
    private String STATUS_CANCELLED;

    @Value("${subscription.status.expired}")
    private String STATUS_EXPIRED;

    @Autowired
    private SubscriptionPlanRepository planRepository;

    @Autowired
    private SubscriptionFeatureRepository featureRepository;

    @Autowired
    private PlanFeatureMappingRepository mappingRepository;

    @Autowired
    private RestaurantSubscriptionRepository restaurantSubscriptionRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Override
    @Transactional
    public SubscriptionPlanDto createPlan(SubscriptionPlanRequest request) {
        SubscriptionPlan plan = SubscriptionPlan.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .billingCycle(request.getBillingCycle())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        plan = planRepository.save(plan);

        if (request.getFeatures() != null && !request.getFeatures().isEmpty()) {
            saveFeatureMappings(plan, request.getFeatures());
        }

        return mapToDto(planRepository.findById(plan.getId()).orElse(plan));
    }

    @Override
    @Transactional
    public SubscriptionPlanDto updatePlan(Long planId, SubscriptionPlanRequest request) {
        SubscriptionPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found with id: " + planId));

        plan.setName(request.getName());
        plan.setDescription(request.getDescription());
        plan.setPrice(request.getPrice());
        plan.setBillingCycle(request.getBillingCycle());
        if (request.getIsActive() != null) {
            plan.setIsActive(request.getIsActive());
        }

        mappingRepository.deleteByPlanId(planId);
        
        if (request.getFeatures() != null && !request.getFeatures().isEmpty()) {
            saveFeatureMappings(plan, request.getFeatures());
        }

        return mapToDto(planRepository.save(plan));
    }

    private void saveFeatureMappings(SubscriptionPlan plan, List<FeatureMappingRequest> features) {
        for (FeatureMappingRequest fmr : features) {
            SubscriptionFeature feature = featureRepository.findById(fmr.getFeatureId())
                    .orElseThrow(() -> new RuntimeException("Feature not found with id: " + fmr.getFeatureId()));
            
            PlanFeatureMapping mapping = PlanFeatureMapping.builder()
                    .plan(plan)
                    .feature(feature)
                    .featureValue(fmr.getFeatureValue())
                    .build();
            mappingRepository.save(mapping);
        }
    }

    @Override
    @Transactional
    public void deletePlan(Long planId) {
        if (!planRepository.existsById(planId)) {
            throw new RuntimeException("Plan not found with id: " + planId);
        }
        planRepository.deleteById(planId);
    }

    @Override
    public List<SubscriptionPlanDto> getAllPlans() {
        return planRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public SubscriptionPlanDto getPlanById(Long planId) {
        return planRepository.findById(planId)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Plan not found with id: " + planId));
    }

    @Override
    @Transactional
    public RestaurantSubscriptionDto assignPlanToRestaurant(Long restaurantId, RestaurantSubscriptionRequest request) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + restaurantId));

        SubscriptionPlan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan not found with id: " + request.getPlanId()));

        Optional<RestaurantSubscription> existingActive = restaurantSubscriptionRepository.findActiveSubscriptionByRestaurantId(restaurantId);
        if (existingActive.isPresent()) {
            RestaurantSubscription activeSub = existingActive.get();
            activeSub.setStatus(STATUS_CANCELLED);
            activeSub.setEndDate(LocalDateTime.now());
            restaurantSubscriptionRepository.save(activeSub);
        }

        LocalDateTime startDate = LocalDateTime.now();
        LocalDateTime endDate = startDate.plusMonths(request.getDurationInMonths() != null ? request.getDurationInMonths() : 1);

        RestaurantSubscription subscription = RestaurantSubscription.builder()
                .restaurant(restaurant)
                .plan(plan)
                .startDate(startDate)
                .endDate(endDate)
                .status(STATUS_ACTIVE)
                .isAutoRenew(request.getIsAutoRenew() != null ? request.getIsAutoRenew() : true)
                .build();

        subscription = restaurantSubscriptionRepository.save(subscription);
        return mapToDto(subscription);
    }

    @Override
    public RestaurantSubscriptionDto getRestaurantSubscription(Long restaurantId) {
        return restaurantSubscriptionRepository.findActiveSubscriptionByRestaurantId(restaurantId)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("No active subscription found for restaurant id: " + restaurantId));
    }

    @Override
    public boolean isFeatureEnabled(Long restaurantId, String featureKey) {
        Optional<RestaurantSubscription> activeSub = restaurantSubscriptionRepository.findActiveSubscriptionByRestaurantId(restaurantId);
        if (activeSub.isEmpty()) {
            return false;
        }

        SubscriptionPlan plan = activeSub.get().getPlan();
        List<PlanFeatureMapping> mappings = mappingRepository.findByPlanId(plan.getId());
        
        for (PlanFeatureMapping mapping : mappings) {
            if (mapping.getFeature().getFeatureKey().equals(featureKey)) {
                String val = mapping.getFeatureValue();
                return val != null && !val.equalsIgnoreCase("false") && !val.equals("0");
            }
        }
        return false;
    }

    private SubscriptionPlanDto mapToDto(SubscriptionPlan plan) {
        List<PlanFeatureMappingDto> featureDtos = new ArrayList<>();
        if (plan.getFeatures() != null) {
            featureDtos = plan.getFeatures().stream().map(f -> PlanFeatureMappingDto.builder()
                    .id(f.getId())
                    .featureId(f.getFeature().getId())
                    .featureKey(f.getFeature().getFeatureKey())
                    .featureValue(f.getFeatureValue())
                    .build()).collect(Collectors.toList());
        } else {
            List<PlanFeatureMapping> mappings = mappingRepository.findByPlanId(plan.getId());
            featureDtos = mappings.stream().map(f -> PlanFeatureMappingDto.builder()
                    .id(f.getId())
                    .featureId(f.getFeature().getId())
                    .featureKey(f.getFeature().getFeatureKey())
                    .featureValue(f.getFeatureValue())
                    .build()).collect(Collectors.toList());
        }

        return SubscriptionPlanDto.builder()
                .id(plan.getId())
                .name(plan.getName())
                .description(plan.getDescription())
                .price(plan.getPrice())
                .billingCycle(plan.getBillingCycle())
                .isActive(plan.getIsActive())
                .features(featureDtos)
                .build();
    }

    private RestaurantSubscriptionDto mapToDto(RestaurantSubscription rs) {
        return RestaurantSubscriptionDto.builder()
                .id(rs.getId())
                .restaurantId(rs.getRestaurant().getRestId())
                .plan(mapToDto(rs.getPlan()))
                .startDate(rs.getStartDate())
                .endDate(rs.getEndDate())
                .status(rs.getStatus())
                .isAutoRenew(rs.getIsAutoRenew())
                .build();
    }

    @Override
    @Transactional
    public SubscriptionFeatureDto createFeature(SubscriptionFeatureRequest request) {
        SubscriptionFeature feature = SubscriptionFeature.builder()
                .featureKey(request.getFeatureKey())
                .displayName(request.getDisplayName())
                .description(request.getDescription())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();
        feature = featureRepository.save(feature);
        return mapToFeatureDto(feature);
    }

    @Override
    @Transactional
    public SubscriptionFeatureDto updateFeature(Long id, SubscriptionFeatureRequest request) {
        SubscriptionFeature feature = featureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feature not found with id: " + id));
        feature.setFeatureKey(request.getFeatureKey());
        feature.setDisplayName(request.getDisplayName());
        feature.setDescription(request.getDescription());
        if (request.getIsActive() != null) {
            feature.setIsActive(request.getIsActive());
        }
        feature = featureRepository.save(feature);
        return mapToFeatureDto(feature);
    }

    @Override
    @Transactional
    public void deleteFeature(Long id) {
        if (!featureRepository.existsById(id)) {
            throw new RuntimeException("Feature not found with id: " + id);
        }
        featureRepository.deleteById(id);
    }

    @Override
    public List<SubscriptionFeatureDto> getAllFeatures() {
        return featureRepository.findAll().stream()
                .map(this::mapToFeatureDto)
                .collect(Collectors.toList());
    }

    private SubscriptionFeatureDto mapToFeatureDto(SubscriptionFeature feature) {
        return SubscriptionFeatureDto.builder()
                .id(feature.getId())
                .featureKey(feature.getFeatureKey())
                .displayName(feature.getDisplayName())
                .description(feature.getDescription())
                .isActive(feature.getIsActive())
                .build();
    }
}
