package com.restroly.qrmenu.subscription.repository;

import com.restroly.qrmenu.subscription.entity.RestaurantSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface RestaurantSubscriptionRepository extends JpaRepository<RestaurantSubscription, Long> {

    Optional<RestaurantSubscription> findByRestIdAndActiveTrueAndEndDateAfter(
            Long restaurantId,
            LocalDateTime now
    );
}