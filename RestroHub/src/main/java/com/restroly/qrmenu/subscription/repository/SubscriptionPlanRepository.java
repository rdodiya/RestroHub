package com.restroly.qrmenu.subscription.repository;

import com.restroly.qrmenu.subscription.entity.SubscriptionPlan;
import com.restroly.qrmenu.subscription.enums.SubscriptionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, Long> {

    Optional<SubscriptionPlan> findByTypeAndActiveTrue(SubscriptionType type);
}
