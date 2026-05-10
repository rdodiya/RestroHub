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
public class SiteConfigUpdateRequest {

    @Size(max = 100, message = "Site name must not exceed 100 characters")
    private String siteName;

    @Size(max = 100, message = "Page slug must not exceed 100 characters")
    private String pageSlug;

    private Long templateId;

    private Long themeId;

    private Map<String, Object> dataJson;

    private Map<String, Object> metaData;

    private Boolean isPublished;
}