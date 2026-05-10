package com.restroly.qrmenu.template.mapper;

import com.restroly.qrmenu.template.dto.PublicSiteConfigResponse;
import com.restroly.qrmenu.template.dto.SiteConfigCreateRequest;
import com.restroly.qrmenu.template.dto.SiteConfigDTO;
import com.restroly.qrmenu.template.dto.SiteConfigUpdateRequest;
import com.restroly.qrmenu.template.entity.SiteConfig;
import com.restroly.qrmenu.template.entity.Template;
import com.restroly.qrmenu.template.entity.Theme;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class SiteConfigMapper {

    private final ThemeMapper themeMapper;

    public SiteConfigDTO toDTO(SiteConfig siteConfig) {
        if (siteConfig == null) {
            return null;
        }

        SiteConfigDTO.SiteConfigDTOBuilder builder = SiteConfigDTO.builder()
                .id(siteConfig.getId())
                .siteId(siteConfig.getSiteId())
                .siteName(siteConfig.getSiteName())
                .pageSlug(siteConfig.getPageSlug())
//                .dataJson(siteConfig.getDataJson())
                .metaData(siteConfig.getMetaData())
                .isPublished(siteConfig.getIsPublished())
                .restaurantId(siteConfig.getRestaurantId())
                .createdAt(siteConfig.getCreatedAt())
                .updatedAt(siteConfig.getUpdatedAt());

        if (siteConfig.getTemplate() != null) {
            builder.templateId(siteConfig.getTemplate().getId())
                    .templateKey(siteConfig.getTemplate().getTemplateKey())
                    .componentName(siteConfig.getTemplate().getReactComponentName());
        }

        if (siteConfig.getTheme() != null) {
            builder.themeId(siteConfig.getTheme().getId())
                    .themeName(siteConfig.getTheme().getName());
        }

        return builder.build();
    }

    public List<SiteConfigDTO> toDTOList(List<SiteConfig> siteConfigs) {
        return siteConfigs.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public SiteConfig toEntity(SiteConfigCreateRequest request, Template template, Theme theme) {
        if (request == null) {
            return null;
        }

        return SiteConfig.builder()
                .siteId(request.getSiteId())
                .siteName(request.getSiteName())
                .pageSlug(request.getPageSlug())
                .template(template)
                .theme(theme)
//                .dataJson(request.getDataJson())
                .metaData(request.getMetaData())
                .isPublished(request.getIsPublished() != null ? request.getIsPublished() : false)
                .restaurantId(request.getRestaurantId())
                .build();
    }

    public void updateEntity(SiteConfig siteConfig, SiteConfigUpdateRequest request,
                             Template template, Theme theme) {
        if (request.getSiteName() != null) {
            siteConfig.setSiteName(request.getSiteName());
        }
        if (request.getPageSlug() != null) {
            siteConfig.setPageSlug(request.getPageSlug());
        }
        if (template != null) {
            siteConfig.setTemplate(template);
        }
        if (theme != null) {
            siteConfig.setTheme(theme);
        }
//        if (request.getDataJson() != null) {
//            siteConfig.setDataJson(request.getDataJson());
//        }
        if (request.getMetaData() != null) {
            siteConfig.setMetaData(request.getMetaData());
        }
        if (request.getIsPublished() != null) {
            siteConfig.setIsPublished(request.getIsPublished());
        }
    }

    public PublicSiteConfigResponse toPublicResponse(SiteConfig siteConfig) {
        if (siteConfig == null) {
            return null;
        }

        return PublicSiteConfigResponse.builder()
                .templateKey(siteConfig.getTemplate().getTemplateKey())
                .componentName(siteConfig.getTemplate().getReactComponentName())
                .theme(themeMapper.toPublicThemeResponse(siteConfig.getTheme()))
//                .data(siteConfig.getDataJson())
                .metaData(siteConfig.getMetaData())
                .build();
    }
}