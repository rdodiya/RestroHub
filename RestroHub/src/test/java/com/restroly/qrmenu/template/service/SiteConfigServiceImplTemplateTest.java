package com.restroly.qrmenu.template.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.restroly.qrmenu.config.CloudinaryService;
import com.restroly.qrmenu.exception.BusinessException;
import com.restroly.qrmenu.subscription.service.SubscriptionService;
import com.restroly.qrmenu.template.entity.SiteConfig;
import com.restroly.qrmenu.template.mapper.SiteConfigMapper;
import com.restroly.qrmenu.template.repository.SiteConfigRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

class SiteConfigServiceImplTemplateTest {

  private final SubscriptionService subscriptions = mock(SubscriptionService.class);
  private final SiteConfigServiceImpl service =
      new SiteConfigServiceImpl(
          mock(SiteConfigRepository.class),
          mock(SiteConfigMapper.class),
          new ObjectMapper(),
          mock(CloudinaryService.class),
          subscriptions);

  private SiteConfig site() {
    return SiteConfig.builder().restaurantId(5L).templateKey("modern_v2").build();
  }

  @Test
  void freePlanMayPickDefaultTemplates() {
    when(subscriptions.getFeatureValue(5L, "CUSTOM_WEBSITE_TEMPLATES"))
        .thenReturn(Optional.of("2"));
    SiteConfig site = site();

    service.applyTemplateKey(site, "luxury_v1");

    assertThat(site.getTemplateKey()).isEqualTo("luxury_v1");
  }

  @Test
  void freePlanIsRejectedForNonDefaultTemplate() {
    when(subscriptions.getFeatureValue(5L, "CUSTOM_WEBSITE_TEMPLATES"))
        .thenReturn(Optional.of("2"));
    SiteConfig site = site();

    assertThatThrownBy(() -> service.applyTemplateKey(site, "neon_v9"))
        .isInstanceOfSatisfying(
            BusinessException.class,
            e -> {
              assertThat(e.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
              assertThat(e.getMessage()).contains("Upgrade required");
            });
    assertThat(site.getTemplateKey()).isEqualTo("modern_v2");
  }

  @Test
  void proPlanWithAllMayPickAnyTemplate() {
    when(subscriptions.getFeatureValue(5L, "CUSTOM_WEBSITE_TEMPLATES"))
        .thenReturn(Optional.of("ALL"));
    SiteConfig site = site();

    service.applyTemplateKey(site, "neon_v9");

    assertThat(site.getTemplateKey()).isEqualTo("neon_v9");
  }

  @Test
  void noSubscriptionIsTreatedAsFree() {
    when(subscriptions.getFeatureValue(5L, "CUSTOM_WEBSITE_TEMPLATES"))
        .thenReturn(Optional.empty());

    assertThatThrownBy(() -> service.applyTemplateKey(site(), "neon_v9"))
        .isInstanceOf(BusinessException.class);
  }
}
