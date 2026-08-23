package com.restroly.qrmenu.template.mapper;

import com.restroly.qrmenu.menu.mapper.MenuMapper;
import com.restroly.qrmenu.template.dto.SiteConfigDTO;
import com.restroly.qrmenu.template.entity.SiteConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
@RequiredArgsConstructor
public class SiteConfigMapper {

    private final ThemeMapper themeMapper;
    private final SectionMapper sectionMapper;
    private final MenuMapper menuMapper;

    public SiteConfigDTO mapToDTO(SiteConfig siteConfig) {

        if (siteConfig == null) {
            return null;
        }

        return SiteConfigDTO.builder()
                .id(siteConfig.getId())
                .siteId(siteConfig.getSiteId())
                .restaurantId(siteConfig.getRestaurantId())
                .siteName(siteConfig.getSiteName())
                .pageSlug(siteConfig.getPageSlug())
                .templateKey(siteConfig.getTemplateKey())
                .theme(themeMapper.mapToDTO(siteConfig.getTheme()))
                .menu(menuMapper.toResponseDTO(siteConfig.getMenu()))
                .sections(
                        siteConfig.getSections() == null
                                ? Collections.emptyList()
                                : siteConfig.getSections()
                                .stream()
                                .map(sectionMapper::mapToDTO)
                                .toList()
                )
                .isPublished(siteConfig.getIsPublished())
                .createdAt(siteConfig.getCreatedAt())
                .updatedAt(siteConfig.getUpdatedAt())
                .build();
    }

}
