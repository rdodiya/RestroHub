package com.restroly.qrmenu.template.mapper;

import com.restroly.qrmenu.template.dto.SectionTemplateDTO;
import com.restroly.qrmenu.template.entity.SectionTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class SectionTemplateMapper {

    public SectionTemplateDTO toDTO(SectionTemplate template) {
        if (template == null) {
            return null;
        }

        return SectionTemplateDTO.builder()
                .id(template.getId())
                .templateKey(template.getTemplateKey())
                .sectionType(template.getSectionType())
                .reactComponentName(template.getReactComponentName())
                .name(template.getName())
                .description(template.getDescription())
                .previewImageUrl(template.getPreviewImageUrl())
                .defaultContent(template.getDefaultContent())
                .defaultSettings(template.getDefaultSettings())
                .schema(template.getSchema())
                .isActive(template.getIsActive())
                .isPremium(template.getIsPremium())
                .createdAt(template.getCreatedAt())
                .updatedAt(template.getUpdatedAt())
                .build();
    }

    public List<SectionTemplateDTO> toDTOList(List<SectionTemplate> templates) {
        return templates.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}