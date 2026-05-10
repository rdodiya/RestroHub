package com.restroly.qrmenu.template.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SectionUpdateRequest {

    @Size(max = 50, message = "Section type must not exceed 50 characters")
    private String sectionType;

    @Size(max = 100, message = "React component name must not exceed 100 characters")
    private String reactComponentName;

    private Integer displayOrder;

    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @Size(max = 300, message = "Subtitle must not exceed 300 characters")
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
}