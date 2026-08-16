package com.restroly.qrmenu.subscription.repository;

import com.restroly.qrmenu.subscription.entity.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, Long> {
    Optional<SubscriptionPlan> findByName(String name);

    @Query("SELECT DISTINCT p FROM SubscriptionPlan p " +
           "LEFT JOIN FETCH p.features f " +
           "LEFT JOIN FETCH f.feature")
    List<SubscriptionPlan> findAllWithFeatures();

    @Query("SELECT DISTINCT p FROM SubscriptionPlan p " +
           "LEFT JOIN FETCH p.features f " +
           "LEFT JOIN FETCH f.feature " +
           "WHERE p.id = :planId")
    Optional<SubscriptionPlan> findByIdWithFeatures(@Param("planId") Long planId);
}
