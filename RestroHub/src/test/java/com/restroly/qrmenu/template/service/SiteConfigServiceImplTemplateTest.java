package com.restroly.qrmenu.template.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.restroly.qrmenu.config.CloudinaryService;
import com.restroly.qrmenu.exception.BusinessException;
import com.restroly.qrmenu.subscription.service.SubscriptionService;
import com.restroly.qrmenu.template.dto.ThemeDTO;
import com.restroly.qrmenu.template.dto.UpdateSiteConfigRequest;
import com.restroly.qrmenu.template.entity.SiteConfig;
import com.restroly.qrmenu.template.entity.Theme;
import com.restroly.qrmenu.template.mapper.SiteConfigMapper;
import com.restroly.qrmenu.template.repository.SiteConfigRepository;
import java.util.ArrayList;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

class SiteConfigServiceImplTemplateTest {

  private final SiteConfigRepository siteConfigRepository = mock(SiteConfigRepository.class);
  private final SiteConfigMapper siteConfigMapper = mock(SiteConfigMapper.class);
  private final SubscriptionService subscriptions = mock(SubscriptionService.class);
  private final SiteConfigServiceImpl service =
      new SiteConfigServiceImpl(
          siteConfigRepository,
          siteConfigMapper,
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

  @Test
  void updateSiteConfigPreservesExistingThemeNameAndKeyWhenNullInRequest() {
    Theme existingTheme =
        Theme.builder()
            .id(4L)
            .name("Ocean Blue Dark")
            .themeKey("OCEAN_BLUE_DARK")
            .primaryColor("#3b82f6")
            .build();

    SiteConfig site =
        SiteConfig.builder()
            .id(1L)
            .siteId("rajkot-dhaba")
            .restaurantId(1L)
            .templateKey("modern_v2")
            .theme(existingTheme)
            .sections(new ArrayList<>())
            .build();

    when(siteConfigRepository.findBySiteIdWithThemeAndSections("rajkot-dhaba"))
        .thenReturn(Optional.of(site));
    when(siteConfigRepository.save(any(SiteConfig.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    // Request with null name and null themeKey (simulates partial payload from UI)
    ThemeDTO themeDTO =
        ThemeDTO.builder().primaryColor("#ef4444").name(null).themeKey(null).build();

    UpdateSiteConfigRequest request =
        UpdateSiteConfigRequest.builder().templateKey("modern_v2").theme(themeDTO).build();

    service.updateSiteConfig("rajkot-dhaba", request);

    assertThat(existingTheme.getPrimaryColor()).isEqualTo("#ef4444");
    assertThat(existingTheme.getName()).isEqualTo("Ocean Blue Dark");
    assertThat(existingTheme.getThemeKey()).isEqualTo("OCEAN_BLUE_DARK");
  }

  @Test
  void updateSiteConfigProvidesSafeDefaultsWhenExistingThemeHasBlankNameOrKey() {
    Theme existingTheme = Theme.builder().id(4L).name("").themeKey("").primaryColor("").build();

    SiteConfig site =
        SiteConfig.builder()
            .id(1L)
            .siteId("rajkot-dhaba")
            .siteName("Rajkot Dhaba")
            .restaurantId(1L)
            .templateKey("modern_v2")
            .theme(existingTheme)
            .sections(new ArrayList<>())
            .build();

    when(siteConfigRepository.findBySiteIdWithThemeAndSections("rajkot-dhaba"))
        .thenReturn(Optional.of(site));
    when(siteConfigRepository.save(any(SiteConfig.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    ThemeDTO themeDTO = ThemeDTO.builder().primaryColor("#10b981").build();

    UpdateSiteConfigRequest request =
        UpdateSiteConfigRequest.builder().templateKey("modern_v2").theme(themeDTO).build();

    service.updateSiteConfig("rajkot-dhaba", request);

    assertThat(existingTheme.getPrimaryColor()).isEqualTo("#10b981");
    assertThat(existingTheme.getName()).isNotBlank();
    assertThat(existingTheme.getThemeKey()).isNotBlank();
  }

  @Test
  void updateSiteConfigCreatesThemeIfNullOnSiteConfig() {
    SiteConfig site =
        SiteConfig.builder()
            .id(1L)
            .siteId("spice-route")
            .siteName("Spice Route")
            .restaurantId(1L)
            .templateKey("modern_v2")
            .theme(null)
            .sections(new ArrayList<>())
            .build();

    when(siteConfigRepository.findBySiteIdWithThemeAndSections("spice-route"))
        .thenReturn(Optional.of(site));
    when(siteConfigRepository.save(any(SiteConfig.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    ThemeDTO themeDTO = ThemeDTO.builder().primaryColor("#6366f1").build();

    UpdateSiteConfigRequest request =
        UpdateSiteConfigRequest.builder().templateKey("modern_v2").theme(themeDTO).build();

    service.updateSiteConfig("spice-route", request);

    assertThat(site.getTheme()).isNotNull();
    assertThat(site.getTheme().getPrimaryColor()).isEqualTo("#6366f1");
    assertThat(site.getTheme().getName()).isNotBlank();
    assertThat(site.getTheme().getThemeKey()).isNotBlank();
  }
}
