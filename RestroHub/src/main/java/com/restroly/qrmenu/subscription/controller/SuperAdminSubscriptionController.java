package com.restroly.qrmenu.subscription.controller;

import com.restroly.qrmenu.subscription.dto.SubscriptionFeatureDto;
import com.restroly.qrmenu.subscription.dto.SubscriptionFeatureRequest;
import com.restroly.qrmenu.subscription.dto.RestaurantSubscriptionDto;
import com.restroly.qrmenu.subscription.dto.RestaurantSubscriptionRequest;
import com.restroly.qrmenu.subscription.dto.SubscriptionPlanDto;
import com.restroly.qrmenu.subscription.dto.SubscriptionPlanRequest;
import com.restroly.qrmenu.subscription.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.restroly.qrmenu.common.util.ApiConstants.SECURE_API_VERSION;

@RestController
@RequestMapping(SECURE_API_VERSION + "/admin/subscriptions")
public class SuperAdminSubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @PostMapping("/plans")
    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    public ResponseEntity<SubscriptionPlanDto> createPlan(@RequestBody SubscriptionPlanRequest request) {
        return ResponseEntity.ok(subscriptionService.createPlan(request));
    }

    @PutMapping("/plans/{id}")
    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    public ResponseEntity<SubscriptionPlanDto> updatePlan(@PathVariable Long id, @RequestBody SubscriptionPlanRequest request) {
        return ResponseEntity.ok(subscriptionService.updatePlan(id, request));
    }

    @DeleteMapping("/plans/{id}")
    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        subscriptionService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/plans")
    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    public ResponseEntity<List<SubscriptionPlanDto>> getAllPlans() {
        return ResponseEntity.ok(subscriptionService.getAllPlans());
    }

    @GetMapping("/plans/{id}")
    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    public ResponseEntity<SubscriptionPlanDto> getPlanById(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionService.getPlanById(id));
    }

    @PostMapping("/restaurants/{restId}/assign")
    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    public ResponseEntity<RestaurantSubscriptionDto> assignPlanToRestaurant(
            @PathVariable Long restId, 
            @RequestBody RestaurantSubscriptionRequest request) {
        return ResponseEntity.ok(subscriptionService.assignPlanToRestaurant(restId, request));
    }

    @PostMapping("/features")
    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    public ResponseEntity<SubscriptionFeatureDto> createFeature(@RequestBody SubscriptionFeatureRequest request) {
        return ResponseEntity.ok(subscriptionService.createFeature(request));
    }

    @PutMapping("/features/{id}")
    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    public ResponseEntity<SubscriptionFeatureDto> updateFeature(@PathVariable Long id, @RequestBody SubscriptionFeatureRequest request) {
        return ResponseEntity.ok(subscriptionService.updateFeature(id, request));
    }

    @DeleteMapping("/features/{id}")
    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteFeature(@PathVariable Long id) {
        subscriptionService.deleteFeature(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/features")
    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    public ResponseEntity<List<SubscriptionFeatureDto>> getAllFeatures() {
        return ResponseEntity.ok(subscriptionService.getAllFeatures());
    }
}
