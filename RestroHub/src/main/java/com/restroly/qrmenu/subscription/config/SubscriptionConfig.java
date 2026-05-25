package com.restroly.qrmenu.subscription.config;

import com.restroly.qrmenu.subscription.entity.SubscriptionPlan;
import com.restroly.qrmenu.subscription.enums.FeatureType;
import com.restroly.qrmenu.subscription.enums.SubscriptionType;
import com.restroly.qrmenu.subscription.repository.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import java.math.BigDecimal;
import java.util.EnumSet;
import java.util.List;

@Slf4j
@Configuration
@EnableAspectJAutoProxy  // activates AOP proxy so @RequiresFeature aspect fires
@RequiredArgsConstructor
public class SubscriptionConfig {

    private final SubscriptionPlanRepository planRepository;

    /**
     * Seeds default subscription plans on first startup if they don't exist yet.
     * Each plan builds on the previous tier's features — FREE has none,
     * BASIC adds WhatsApp, PRO adds AI + domains, ENTERPRISE unlocks everything.
     */
    @Bean
    public ApplicationRunner seedSubscriptionPlans() {
        return args -> {
            if (planRepository.count() > 0) {
                log.info("Subscription plans already seeded, skipping.");
                return;
            }

            List<SubscriptionPlan> plans = List.of(
                    SubscriptionPlan.builder()
                            .type(SubscriptionType.FREE)
                            .name("Free Plan")
                            .monthlyPrice(BigDecimal.ZERO)
                            .allowedFeatures(EnumSet.noneOf(FeatureType.class))
                            .maxBranches(1)
                            .active(true)
                            .build(),

                    SubscriptionPlan.builder()
                            .type(SubscriptionType.BASIC)
                            .name("Basic Plan")
                            .monthlyPrice(new BigDecimal("499.00"))
                            .allowedFeatures(EnumSet.of(
                                    FeatureType.WHATSAPP_NOTIFICATION,
                                    FeatureType.WEBSITE_TEMPLATE
                            ))
                            .maxBranches(2)
                            .active(true)
                            .build(),

                    SubscriptionPlan.builder()
                            .type(SubscriptionType.PRO)
                            .name("Pro Plan")
                            .monthlyPrice(new BigDecimal("1499.00"))
                            .allowedFeatures(EnumSet.of(
                                    FeatureType.WHATSAPP_NOTIFICATION,
                                    FeatureType.AI_TRANSLATION,
                                    FeatureType.WEBSITE_TEMPLATE,
                                    FeatureType.ADD_BRANCH,
                                    FeatureType.CUSTOM_DOMAIN
                            ))
                            .maxBranches(5)
                            .active(true)
                            .build(),

                    SubscriptionPlan.builder()
                            .type(SubscriptionType.ENTERPRISE)
                            .name("Enterprise Plan")
                            .monthlyPrice(new BigDecimal("4999.00"))
                            .allowedFeatures(EnumSet.allOf(FeatureType.class))
                            .maxBranches(Integer.MAX_VALUE)
                            .active(true)
                            .build()
            );

            planRepository.saveAll(plans);
            log.info("Seeded {} subscription plans.", plans.size());
        };
    }
}