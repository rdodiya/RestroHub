package com.restroly.qrmenu.subscription.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "t_subscription_feature")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionFeature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "feature_key", unique = true, nullable = false)
    private String featureKey;

    @Column(name = "display_name")
    private String displayName;

    private String description;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
}
