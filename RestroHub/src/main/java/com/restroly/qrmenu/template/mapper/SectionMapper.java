package com.restroly.qrmenu.template.mapper;

import com.restroly.qrmenu.template.dto.PublicSiteConfigResponse;
import com.restroly.qrmenu.template.dto.SectionCreateRequest;
import com.restroly.qrmenu.template.dto.SectionDTO;
import com.restroly.qrmenu.template.dto.SectionUpdateRequest;
import com.restroly.qrmenu.template.entity.Section;
import com.restroly.qrmenu.template.entity.SectionTemplate;
import com.restroly.qrmenu.template.entity.SiteConfig;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class SectionMapper {

    public SectionDTO toDTO(Section section) {
        if (section == null) {
            return null;
        }

        return SectionDTO.builder()
                .id(section.getId())
                .sectionKey(section.getSectionKey())
                .sectionType(section.getSectionType())
                .reactComponentName(section.getReactComponentName())
                .displayOrder(section.getDisplayOrder())
                .title(section.getTitle())
                .subtitle(section.getSubtitle())
                .content(section.getContent())
                .settings(section.getSettings())
                .styleOverrides(section.getStyleOverrides())
                .backgroundImage(section.getBackgroundImage())
                .backgroundColor(section.getBackgroundColor())
                .isVisible(section.getIsVisible())
                .isFullWidth(section.getIsFullWidth())
                .paddingTop(section.getPaddingTop())
                .paddingBottom(section.getPaddingBottom())
                .createdAt(section.getCreatedAt())
                .updatedAt(section.getUpdatedAt())
                .build();
    }

    public List<SectionDTO> toDTOList(List<Section> sections) {
        return sections.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Section toEntity(SectionCreateRequest request, SiteConfig siteConfig, Integer displayOrder) {
        if (request == null) {
            return null;
        }

        return Section.builder()
                .sectionKey(request.getSectionKey())
                .sectionType(request.getSectionType())
                .reactComponentName(request.getReactComponentName())
                .displayOrder(displayOrder)
                .title(request.getTitle())
                .subtitle(request.getSubtitle())
                .content(request.getContent())
                .settings(request.getSettings())
                .styleOverrides(request.getStyleOverrides())
                .backgroundImage(request.getBackgroundImage())
                .backgroundColor(request.getBackgroundColor())
                .isVisible(request.getIsVisible() != null ? request.getIsVisible() : true)
                .isFullWidth(request.getIsFullWidth() != null ? request.getIsFullWidth() : true)
                .paddingTop(request.getPaddingTop())
                .paddingBottom(request.getPaddingBottom())
                .siteConfig(siteConfig)
                .build();
    }

    public Section toEntityFromTemplate(SectionTemplate template, SiteConfig siteConfig,
                                        String sectionKey, Integer displayOrder) {
        if (template == null) {
            return null;
        }

        return Section.builder()
                .sectionKey(sectionKey)
                .sectionType(template.getSectionType())
                .reactComponentName(template.getReactComponentName())
                .displayOrder(displayOrder)
                .content(template.getDefaultContent())
                .settings(template.getDefaultSettings())
                .isVisible(true)
                .isFullWidth(true)
                .siteConfig(siteConfig)
                .build();
    }

    public void updateEntity(Section section, SectionUpdateRequest request) {
        if (request.getSectionType() != null) {
            section.setSectionType(request.getSectionType());
        }
        if (request.getReactComponentName() != null) {
            section.setReactComponentName(request.getReactComponentName());
        }
        if (request.getDisplayOrder() != null) {
            section.setDisplayOrder(request.getDisplayOrder());
        }
        if (request.getTitle() != null) {
            section.setTitle(request.getTitle());
        }
        if (request.getSubtitle() != null) {
            section.setSubtitle(request.getSubtitle());
        }
        if (request.getContent() != null) {
            section.setContent(request.getContent());
        }
        if (request.getSettings() != null) {
            section.setSettings(request.getSettings());
        }
        if (request.getStyleOverrides() != null) {
            section.setStyleOverrides(request.getStyleOverrides());
        }
        if (request.getBackgroundImage() != null) {
            section.setBackgroundImage(request.getBackgroundImage());
        }
        if (request.getBackgroundColor() != null) {
            section.setBackgroundColor(request.getBackgroundColor());
        }
        if (request.getIsVisible() != null) {
            section.setIsVisible(request.getIsVisible());
        }
        if (request.getIsFullWidth() != null) {
            section.setIsFullWidth(request.getIsFullWidth());
        }
        if (request.getPaddingTop() != null) {
            section.setPaddingTop(request.getPaddingTop());
        }
        if (request.getPaddingBottom() != null) {
            section.setPaddingBottom(request.getPaddingBottom());
        }
    }

    public PublicSiteConfigResponse.SectionResponse toPublicResponse(Section section) {
        if (section == null) {
            return null;
        }

        // Build style object from section properties
        Map<String, Object> style = new HashMap<>();
        if (section.getBackgroundImage() != null) {
            style.put("backgroundImage", section.getBackgroundImage());
        }
        if (section.getBackgroundColor() != null) {
            style.put("backgroundColor", section.getBackgroundColor());
        }
        if (section.getPaddingTop() != null) {
            style.put("paddingTop", section.getPaddingTop());
        }
        if (section.getPaddingBottom() != null) {
            style.put("paddingBottom", section.getPaddingBottom());
        }
        if (section.getIsFullWidth() != null) {
            style.put("isFullWidth", section.getIsFullWidth());
        }
        if (section.getStyleOverrides() != null) {
            style.putAll(section.getStyleOverrides());
        }

        return PublicSiteConfigResponse.SectionResponse.builder()
                .id(section.getSectionKey())
                .sectionKey(section.getSectionKey())
                .sectionType(section.getSectionType())
                .componentName(section.getReactComponentName())
                .order(section.getDisplayOrder())
                .title(section.getTitle())
                .subtitle(section.getSubtitle())
                .content(section.getContent())
                .settings(section.getSettings())
                .style(style.isEmpty() ? null : style)
                .isVisible(section.getIsVisible())
                .build();
    }

    public List<PublicSiteConfigResponse.SectionResponse> toPublicResponseList(List<Section> sections) {
        return sections.stream()
                .filter(s -> Boolean.TRUE.equals(s.getIsVisible()))
                .map(this::toPublicResponse)
                .collect(Collectors.toList());
    }
}