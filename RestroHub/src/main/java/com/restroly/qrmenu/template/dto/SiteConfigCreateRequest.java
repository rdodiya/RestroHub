package com.restroly.qrmenu.template.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class SiteConfigCreateRequest {

    @NotBlank(message = "Site ID is required")
    @Size(max = 50, message = "Site ID must not exceed 50 characters")
    private String siteId;

    @Size(max = 100, message = "Site name must not exceed 100 characters")
    private String siteName;

    @Size(max = 100, message = "Page slug must not exceed 100 characters")
    private String pageSlug;

    @NotNull(message = "Template ID is required")
    private Long templateId;

    @NotNull(message = "Theme ID is required")
    private Long themeId;

    private Map<String, Object> dataJson;

    private Map<String, Object> metaData;

    private Boolean isPublished;

    private Long restaurantId;
}