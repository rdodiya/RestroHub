package com.restroly.qrmenu.template.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemplateUpdateRequest {

    @Size(max = 100, message = "React component name must not exceed 100 characters")
    private String reactComponentName;

    @Size(max = 100, message = "Template name must not exceed 100 characters")
    private String name;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    private String previewImageUrl;

    private String category;

    private Boolean isActive;

    private Boolean isPremium;
}