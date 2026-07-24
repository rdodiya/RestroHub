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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SiteConfigServiceImpl implements SiteConfigService {

    private final SiteConfigRepository siteConfigRepository;
    private final SiteConfigMapper siteConfigMapper;
    private final ObjectMapper objectMapper;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "siteConfigs", key = "#siteId")
    public SiteConfigDTO getPublicSiteConfig(String siteId) {
        log.debug("Fetching public site config for siteId: {}", siteId);

        SiteConfig siteConfig = siteConfigRepository.findPublishedBySiteIdWithMenuAndThemeAndSections(siteId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Published site config not found for siteId: " + siteId));

        return siteConfigMapper.mapToDTO(siteConfig);
    }

    @Override
    public SiteConfigDTO updateSiteConfig(
            String siteId,
            UpdateSiteConfigRequest request) {

        SiteConfig siteConfig = siteConfigRepository
                .findBySiteIdWithThemeAndSections(siteId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Site not found : " + siteId));

        updateTheme(siteConfig.getTheme(), request.getTheme());

        processBase64Images(request.getSections());
        updateSections(siteConfig, request.getSections());

        SiteConfig saved = siteConfigRepository.save(siteConfig);

        return siteConfigMapper.mapToDTO(saved);
    }

    /**
     * Update Theme
     */
    private void updateTheme(
            Theme theme,
            ThemeDTO dto) {

        if (theme == null || dto == null) {
            return;
        }

        theme.setName(dto.getName());
        theme.setThemeKey(dto.getThemeKey());
        theme.setDescription(dto.getDescription());

        theme.setPrimaryColor(dto.getPrimaryColor());
        theme.setColorPrimaryHover(dto.getColorPrimaryHover());
        theme.setColorPrimaryDark(dto.getColorPrimaryDark());

        theme.setSecondaryColor(dto.getSecondaryColor());
        theme.setColorAccent(dto.getColorAccent());

        theme.setBgPrimary(dto.getBgPrimary());
        theme.setBgSecondary(dto.getBgSecondary());
        theme.setBgTertiary(dto.getBgTertiary());

        theme.setPrimaryTextColor(dto.getPrimaryTextColor());
        theme.setSecondaryTextColor(dto.getSecondaryTextColor());
        theme.setTextMuted(dto.getTextMuted());

        theme.setHeaderBackground(dto.getHeaderBackground());
        theme.setFooterBackground(dto.getFooterBackground());

        theme.setButtonBackground(dto.getButtonBackground());
        theme.setButtonText(dto.getButtonText());

        theme.setBorderColor(dto.getBorderColor());

        theme.setFontPrimary(dto.getFontPrimary());
        theme.setFontHeading(dto.getFontHeading());
        theme.setFontSizeBase(dto.getFontSizeBase());

        theme.setCustomStylesJson(dto.getCustomStylesJson());

        theme.setIsActive(dto.getIsActive());
        theme.setIsDefault(dto.getIsDefault());
        theme.setIsDarkMode(dto.getIsDarkMode());
    }

    /**
     * Update Sections
     */
    private void updateSections(
            SiteConfig siteConfig,
            List<SectionDTO> sectionDTOs) {

        if (sectionDTOs == null || sectionDTOs.isEmpty()) {
            return;
        }

        Map<SectionType, Section> existingSections =
                siteConfig.getSections()
                        .stream()
                        .collect(Collectors.toMap(
                                Section::getSectionKey,
                                Function.identity()));
        int counter = 0;
        for (SectionDTO dto : sectionDTOs) {

            Section section = existingSections.get(dto.getSectionKey());

            if (section == null) {
                continue;
            }

            section.setContent(dto.getContent());
            section.setStyles(dto.getStyles());
            section.setDisplayOrder(counter++);
            section.setIsVisible(dto.getIsVisible());
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

                    ImageUploadDTO dto = objectMapper.convertValue(
                                    imageMap,
                                    ImageUploadDTO.class);
                    String imageUrl = cloudinaryService.uploadBase64(dto, "preview");
                    entry.setValue(imageUrl);
                }
                // Nested object
                else {
                    replaceImages((Map<String, Object>) nestedMap);
                }
            }
            else if (value instanceof List<?> list) {

                for (Object obj : list) {
                    if (obj instanceof Map<?, ?> child) {
                        replaceImages((Map<String, Object>) child);
                    }
                }
            }
        }
    }


}