package com.restroly.qrmenu.subscription.repository;

import com.restroly.qrmenu.subscription.entity.RestaurantSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantSubscriptionRepository extends JpaRepository<RestaurantSubscription, Long> {
    
    @Query("SELECT rs FROM RestaurantSubscription rs WHERE rs.restaurant.restId = :restId AND rs.status = 'ACTIVE'")
    Optional<RestaurantSubscription> findActiveSubscriptionByRestaurantId(@Param("restId") Long restId);
    
    List<RestaurantSubscription> findByRestaurantRestId(Long restId);
}
