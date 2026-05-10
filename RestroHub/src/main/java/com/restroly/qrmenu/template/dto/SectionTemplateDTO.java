package com.restroly.qrmenu.template.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SectionTemplateDTO {

    private Long id;
    private String templateKey;
    private String sectionType;
    private String reactComponentName;
    private String name;
    private String description;
    private String previewImageUrl;
    private Map<String, Object> defaultContent;
    private Map<String, Object> defaultSettings;
    private Map<String, Object> schema;
    private Boolean isActive;
    private Boolean isPremium;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}