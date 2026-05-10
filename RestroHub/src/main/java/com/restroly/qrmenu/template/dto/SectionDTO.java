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
public class SectionDTO {

    private Long id;
    private String sectionKey;
    private String sectionType;
    private String reactComponentName;
    private Integer displayOrder;
    private String title;
    private String subtitle;
    private Map<String, Object> content;
    private Map<String, Object> settings;
    private Map<String, Object> styleOverrides;
    private String backgroundImage;
    private String backgroundColor;
    private Boolean isVisible;
    private Boolean isFullWidth;
    private String paddingTop;
    private String paddingBottom;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}