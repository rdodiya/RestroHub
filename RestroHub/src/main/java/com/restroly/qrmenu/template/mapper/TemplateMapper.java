package com.restroly.qrmenu.template.mapper;

import com.restroly.qrmenu.template.dto.TemplateCreateRequest;
import com.restroly.qrmenu.template.dto.TemplateDTO;
import com.restroly.qrmenu.template.dto.TemplateUpdateRequest;
import com.restroly.qrmenu.template.entity.Template;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TemplateMapper {

    public TemplateDTO toDTO(Template template) {
        if (template == null) {
            return null;
        }

        return TemplateDTO.builder()
                .id(template.getId())
                .templateKey(template.getTemplateKey())
                .reactComponentName(template.getReactComponentName())
                .name(template.getName())
                .description(template.getDescription())
                .previewImageUrl(template.getPreviewImageUrl())
                .category(template.getCategory())
                .isActive(template.getIsActive())
                .isPremium(template.getIsPremium())
                .createdAt(template.getCreatedAt())
                .updatedAt(template.getUpdatedAt())
                .build();
    }

    public List<TemplateDTO> toDTOList(List<Template> templates) {
        return templates.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Template toEntity(TemplateCreateRequest request) {
        if (request == null) {
            return null;
        }

        return Template.builder()
                .templateKey(request.getTemplateKey())
                .reactComponentName(request.getReactComponentName())
                .name(request.getName())
                .description(request.getDescription())
                .previewImageUrl(request.getPreviewImageUrl())
                .category(request.getCategory())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .isPremium(request.getIsPremium() != null ? request.getIsPremium() : false)
                .build();
    }

    public void updateEntity(Template template, TemplateUpdateRequest request) {
        if (request.getReactComponentName() != null) {
            template.setReactComponentName(request.getReactComponentName());
        }
        if (request.getName() != null) {
            template.setName(request.getName());
        }
        if (request.getDescription() != null) {
            template.setDescription(request.getDescription());
        }
        if (request.getPreviewImageUrl() != null) {
            template.setPreviewImageUrl(request.getPreviewImageUrl());
        }
        if (request.getCategory() != null) {
            template.setCategory(request.getCategory());
        }
        if (request.getIsActive() != null) {
            template.setIsActive(request.getIsActive());
        }
        if (request.getIsPremium() != null) {
            template.setIsPremium(request.getIsPremium());
        }
    }
}