package com.restroly.qrmenu.subscription.repository;

import com.restroly.qrmenu.subscription.entity.PlanFeatureMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlanFeatureMappingRepository extends JpaRepository<PlanFeatureMapping, Long> {
    List<PlanFeatureMapping> findByPlanId(Long planId);
    Optional<PlanFeatureMapping> findByPlanIdAndFeatureId(Long planId, Long featureId);
    void deleteByPlanId(Long planId);
}
