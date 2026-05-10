package com.restroly.qrmenu.template.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemplateCreateRequest {

    @NotBlank(message = "Template key is required")
    @Size(max = 50, message = "Template key must not exceed 50 characters")
    private String templateKey;

    @NotBlank(message = "React component name is required")
    @Size(max = 100, message = "React component name must not exceed 100 characters")
    private String reactComponentName;

    @NotBlank(message = "Template name is required")
    @Size(max = 100, message = "Template name must not exceed 100 characters")
    private String name;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    private String previewImageUrl;

    private String category;

    private Boolean isActive;

    private Boolean isPremium;
}