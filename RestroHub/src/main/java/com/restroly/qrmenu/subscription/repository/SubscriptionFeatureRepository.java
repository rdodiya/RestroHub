package com.restroly.qrmenu.subscription.repository;

import com.restroly.qrmenu.subscription.entity.SubscriptionFeature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubscriptionFeatureRepository extends JpaRepository<SubscriptionFeature, Long> {
    Optional<SubscriptionFeature> findByFeatureKey(String featureKey);
}
