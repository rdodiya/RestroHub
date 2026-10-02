package com.restroly.qrmenu.subscription.controller;

import static com.restroly.qrmenu.common.util.ApiConstants.SECURE_API_VERSION;

import com.restroly.qrmenu.subscription.dto.RestaurantSubscriptionDto;
import com.restroly.qrmenu.subscription.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(SECURE_API_VERSION + "/restaurant/{restId}/subscription")
public class RestaurantSubscriptionController {

  @Autowired private SubscriptionService subscriptionService;

  @GetMapping
  @PreAuthorize("@access.can('RESTAURANT_SETTINGS') and @access.restaurant(#restId)")
  public ResponseEntity<RestaurantSubscriptionDto> getRestaurantSubscription(
      @PathVariable Long restId) {
    return ResponseEntity.ok(subscriptionService.getRestaurantSubscription(restId));
  }
}
