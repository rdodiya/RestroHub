package com.restroly.qrmenu.subscription.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "t_plan_feature_mapping")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanFeatureMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private SubscriptionPlan plan;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "feature_id", nullable = false)
    private SubscriptionFeature feature;

    @Column(name = "feature_value", nullable = false)
    private String featureValue; // Can be "true", "false", or a number like "3"
}
