package com.restroly.qrmenu.template.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemplateDTO {

    private Long id;
    private String templateKey;
    private String reactComponentName;
    private String name;
    private String description;
    private String previewImageUrl;
    private String category;
    private Boolean isActive;
    private Boolean isPremium;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}