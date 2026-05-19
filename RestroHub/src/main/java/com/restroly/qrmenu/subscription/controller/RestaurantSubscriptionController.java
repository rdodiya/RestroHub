package com.restroly.qrmenu.subscription.controller;

import com.restroly.qrmenu.subscription.dto.RestaurantSubscriptionDto;
import com.restroly.qrmenu.subscription.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static com.restroly.qrmenu.common.util.ApiConstants.SECURE_API_VERSION;

@RestController
@RequestMapping(SECURE_API_VERSION + "/restaurant/{restId}/subscription")
public class RestaurantSubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('RESTAURANT_OWNER', 'SUPER_ADMIN')")
    public ResponseEntity<RestaurantSubscriptionDto> getRestaurantSubscription(@PathVariable Long restId) {
        return ResponseEntity.ok(subscriptionService.getRestaurantSubscription(restId));
    }
}
