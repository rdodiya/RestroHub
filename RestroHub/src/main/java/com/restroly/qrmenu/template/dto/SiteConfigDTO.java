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
public class SiteConfigDTO {

    private Long id;
    private String siteId;
    private String siteName;
    private String pageSlug;
    private Long templateId;
    private String templateKey;
    private String componentName;
    private Long themeId;
    private String themeName;
    private Map<String, Object> dataJson;
    private Map<String, Object> metaData;
    private Boolean isPublished;
    private Long restaurantId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}