package com.restroly.qrmenu.template.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.restroly.qrmenu.config.CloudinaryService;
import com.restroly.qrmenu.exception.ResourceNotFoundException;
import com.restroly.qrmenu.template.dto.*;
import com.restroly.qrmenu.template.entity.Section;
import com.restroly.qrmenu.template.entity.SectionType;
import com.restroly.qrmenu.template.entity.SiteConfig;
import com.restroly.qrmenu.template.entity.Theme;
import com.restroly.qrmenu.template.mapper.SiteConfigMapper;
import com.restroly.qrmenu.template.repository.SiteConfigRepository;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SiteConfigServiceImpl implements SiteConfigService {

  private final SiteConfigRepository siteConfigRepository;
  private final SiteConfigMapper siteConfigMapper;
  private final ObjectMapper objectMapper;
  private final CloudinaryService cloudinaryService;
  private final com.restroly.qrmenu.subscription.service.SubscriptionService subscriptionService;

  /** Templates every plan (incl. Free) may use. */
  static final java.util.Set<String> DEFAULT_TEMPLATES = java.util.Set.of("modern_v2", "luxury_v1");

  @Override
  @Transactional(readOnly = true)
  @Cacheable(value = "siteConfigs", key = "#siteId")
  public SiteConfigDTO getPublicSiteConfig(String siteId) {
    log.debug("Fetching public site config for siteId: {}", siteId);

    SiteConfig siteConfig =
        siteConfigRepository
            .findPublishedBySiteIdWithMenuAndThemeAndSections(siteId)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        "Published site config not found for siteId: " + siteId));

    return siteConfigMapper.mapToDTO(siteConfig);
  }

  @Override
  public SiteConfigDTO updateSiteConfig(String siteId, UpdateSiteConfigRequest request) {

    SiteConfig siteConfig =
        siteConfigRepository
            .findBySiteIdWithThemeAndSections(siteId)
            .orElseThrow(() -> new ResourceNotFoundException("Site not found : " + siteId));

    applyTemplateKey(siteConfig, request.getTemplateKey());

    if (request.getTheme() != null) {
      if (siteConfig.getTheme() == null) {
        Theme newTheme = new Theme();
        siteConfig.setTheme(newTheme);
      }
      updateTheme(siteConfig.getTheme(), request.getTheme(), siteConfig);
    }

    processBase64Images(request.getSections());
    updateSections(siteConfig, request.getSections());

    SiteConfig saved = siteConfigRepository.save(siteConfig);

    return siteConfigMapper.mapToDTO(saved);
  }

  /**
   * Free-plan restaurants may only pick the default templates; a CUSTOM_WEBSITE_TEMPLATES plan
   * value of "ALL" unlocks the rest.
   */
  void applyTemplateKey(SiteConfig siteConfig, String templateKey) {
    if (templateKey == null
        || templateKey.isBlank()
        || templateKey.equals(siteConfig.getTemplateKey())) {
      return;
    }
    boolean allowed =
        DEFAULT_TEMPLATES.contains(templateKey)
            || subscriptionService
                .getFeatureValue(siteConfig.getRestaurantId(), "CUSTOM_WEBSITE_TEMPLATES")
                .filter("ALL"::equalsIgnoreCase)
                .isPresent();
    if (!allowed) {
      throw new com.restroly.qrmenu.exception.BusinessException(
          "Upgrade required: your plan only includes the default templates",
          org.springframework.http.HttpStatus.FORBIDDEN,
          "UPGRADE_REQUIRED");
    }
    siteConfig.setTemplateKey(templateKey);
  }

  /** Update Theme */
  private void updateTheme(Theme theme, ThemeDTO dto, SiteConfig siteConfig) {

    if (theme == null || dto == null) {
      return;
    }

    if (dto.getName() != null && !dto.getName().isBlank()) {
      theme.setName(dto.getName().trim());
    } else if (theme.getName() == null || theme.getName().isBlank()) {
      theme.setName(
          siteConfig != null
                  && siteConfig.getSiteName() != null
                  && !siteConfig.getSiteName().isBlank()
              ? siteConfig.getSiteName() + " Theme"
              : "Default Theme");
    }

    if (dto.getThemeKey() != null && !dto.getThemeKey().isBlank()) {
      theme.setThemeKey(dto.getThemeKey().trim());
    } else if (theme.getThemeKey() == null || theme.getThemeKey().isBlank()) {
      String keySeed =
          (siteConfig != null && siteConfig.getSiteId() != null)
              ? siteConfig.getSiteId().toUpperCase().replaceAll("[^A-Z0-9_]", "_")
              : (theme.getId() != null ? String.valueOf(theme.getId()) : "DEFAULT");
      theme.setThemeKey("THEME_" + keySeed);
    }

    if (dto.getDescription() != null) {
      theme.setDescription(dto.getDescription());
    }

    if (dto.getPrimaryColor() != null && !dto.getPrimaryColor().isBlank()) {
      theme.setPrimaryColor(dto.getPrimaryColor().trim());
    } else if (theme.getPrimaryColor() == null || theme.getPrimaryColor().isBlank()) {
      theme.setPrimaryColor("#3b82f6");
    }

    if (dto.getColorPrimaryHover() != null) {
      theme.setColorPrimaryHover(dto.getColorPrimaryHover());
    }
    if (dto.getColorPrimaryDark() != null) {
      theme.setColorPrimaryDark(dto.getColorPrimaryDark());
    }

    if (dto.getSecondaryColor() != null) {
      theme.setSecondaryColor(dto.getSecondaryColor());
    }
    if (dto.getColorAccent() != null) {
      theme.setColorAccent(dto.getColorAccent());
    }

    if (dto.getBgPrimary() != null) {
      theme.setBgPrimary(dto.getBgPrimary());
    }
    if (dto.getBgSecondary() != null) {
      theme.setBgSecondary(dto.getBgSecondary());
    }
    if (dto.getBgTertiary() != null) {
      theme.setBgTertiary(dto.getBgTertiary());
    }

    if (dto.getPrimaryTextColor() != null) {
      theme.setPrimaryTextColor(dto.getPrimaryTextColor());
    }
    if (dto.getSecondaryTextColor() != null) {
      theme.setSecondaryTextColor(dto.getSecondaryTextColor());
    }
    if (dto.getTextMuted() != null) {
      theme.setTextMuted(dto.getTextMuted());
    }

    if (dto.getHeaderBackground() != null) {
      theme.setHeaderBackground(dto.getHeaderBackground());
    }
    if (dto.getFooterBackground() != null) {
      theme.setFooterBackground(dto.getFooterBackground());
    }

    if (dto.getButtonBackground() != null) {
      theme.setButtonBackground(dto.getButtonBackground());
    }
    if (dto.getButtonText() != null) {
      theme.setButtonText(dto.getButtonText());
    }

    if (dto.getBorderColor() != null) {
      theme.setBorderColor(dto.getBorderColor());
    }

    if (dto.getFontPrimary() != null) {
      theme.setFontPrimary(dto.getFontPrimary());
    }
    if (dto.getFontHeading() != null) {
      theme.setFontHeading(dto.getFontHeading());
    }
    if (dto.getFontSizeBase() != null) {
      theme.setFontSizeBase(dto.getFontSizeBase());
    }

    if (dto.getCustomStylesJson() != null) {
      theme.setCustomStylesJson(dto.getCustomStylesJson());
    }

    if (dto.getIsActive() != null) {
      theme.setIsActive(dto.getIsActive());
    }
    if (dto.getIsDefault() != null) {
      theme.setIsDefault(dto.getIsDefault());
    }
    if (dto.getIsDarkMode() != null) {
      theme.setIsDarkMode(dto.getIsDarkMode());
    }
  }

  /** Update Sections */
  private void updateSections(SiteConfig siteConfig, List<SectionDTO> sectionDTOs) {

    if (sectionDTOs == null || sectionDTOs.isEmpty()) {
      return;
    }

    Map<SectionType, Section> existingSections =
        siteConfig.getSections().stream()
            .collect(Collectors.toMap(Section::getSectionKey, Function.identity()));
    int counter = 0;
    for (SectionDTO dto : sectionDTOs) {

      if (dto.getSectionKey() == null) {
        continue;
      }

      Section section = existingSections.get(dto.getSectionKey());

      if (section == null) {
        Section newSection =
            Section.builder()
                .sectionKey(dto.getSectionKey())
                .displayOrder(counter++)
                .isVisible(dto.getIsVisible() != null ? dto.getIsVisible() : true)
                .content(dto.getContent())
                .styles(dto.getStyles())
                .siteConfig(siteConfig)
                .build();
        siteConfig.addSection(newSection);
        continue;
      }

      if (dto.getContent() != null) {
        section.setContent(dto.getContent());
      }
      if (dto.getStyles() != null) {
        section.setStyles(dto.getStyles());
      }
      section.setDisplayOrder(counter++);
      if (dto.getIsVisible() != null) {
        section.setIsVisible(dto.getIsVisible());
      }
    }
  }

  private void processBase64Images(List<SectionDTO> sections) {

    if (sections == null) {
      return;
    }
    for (SectionDTO section : sections) {
      if (section.getContent() == null) {
        continue;
      }
      replaceImages(section.getContent());
    }
  }

  @SuppressWarnings("unchecked")
  private void replaceImages(Map<String, Object> map) {

    for (Map.Entry<String, Object> entry : map.entrySet()) {

      Object value = entry.getValue();

      if (value instanceof Map<?, ?> nestedMap) {

        Map<String, Object> imageMap = (Map<String, Object>) nestedMap;
        // Image object
        if (imageMap.containsKey("base64")) {

          ImageUploadDTO dto = objectMapper.convertValue(imageMap, ImageUploadDTO.class);
          String imageUrl = cloudinaryService.uploadBase64(dto, "preview");
          entry.setValue(imageUrl);
        }
        // Nested object
        else {
          replaceImages((Map<String, Object>) nestedMap);
        }
      } else if (value instanceof List<?> list) {

        for (Object obj : list) {
          if (obj instanceof Map<?, ?> child) {
            replaceImages((Map<String, Object>) child);
          }
        }
      }
    }
  }
}
