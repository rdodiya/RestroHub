package com.restroly.qrmenu.template.mapper;

import com.restroly.qrmenu.template.dto.SectionDTO;
import com.restroly.qrmenu.template.entity.Section;
import org.springframework.stereotype.Component;

@Component
public class SectionMapper {

    public SectionDTO mapToDTO(Section section) {

        if (section == null) {
            return null;
        }

        return SectionDTO.builder()
                .id(section.getId())
                .sectionKey(section.getSectionKey())
                .displayOrder(section.getDisplayOrder())
                .isVisible(section.getIsVisible())
                .content(section.getContent())
                .styles(section.getStyles())
                .createdAt(section.getCreatedAt())
                .updatedAt(section.getUpdatedAt())
                .build();
    }

}