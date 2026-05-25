package com.restroly.qrmenu.subscription.entity;
import com.restroly.qrmenu.subscription.enums.FeatureType;
import com.restroly.qrmenu.subscription.enums.SubscriptionType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.Set;

@Entity
@Table(name = "subscription_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private SubscriptionType type;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal monthlyPrice;

    @ElementCollection(targetClass = FeatureType.class, fetch = FetchType.EAGER)
    @CollectionTable(
            name = "plan_features",
            joinColumns = @JoinColumn(name = "plan_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "feature")
    private Set<FeatureType> allowedFeatures;

    @Column(nullable = false)
    private int maxBranches;

    @Column(nullable = false)
    private boolean active;
}
