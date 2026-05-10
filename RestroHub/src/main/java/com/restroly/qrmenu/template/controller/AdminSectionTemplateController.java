package com.restroly.qrmenu.template.controller;

import com.restroly.qrmenu.common.util.ApiConstants;
import com.restroly.qrmenu.template.dto.SectionTemplateDTO;
import com.restroly.qrmenu.template.service.SectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.restroly.qrmenu.common.util.ApiConstants.SECURE_API_VERSION;

@RestController
@RequestMapping(SECURE_API_VERSION+ "/admin/section-templates")
@RequiredArgsConstructor
@Tag(name = "Admin Section Template Management", description = "APIs for managing section templates")
public class AdminSectionTemplateController {

    private final SectionService sectionService;

    @GetMapping
    @Operation(summary = "Get all available section templates")
    public ResponseEntity<List<SectionTemplateDTO>> getAllSectionTemplates() {
        List<SectionTemplateDTO> templates = sectionService.getAvailableSectionTemplates();
        return ResponseEntity.ok(templates);
    }

    @GetMapping("/type/{sectionType}")
    @Operation(summary = "Get section templates by type")
    public ResponseEntity<List<SectionTemplateDTO>> getSectionTemplatesByType(
            @Parameter(description = "Section type (hero, about, menu, gallery, contact, etc.)")
            @PathVariable String sectionType) {
        List<SectionTemplateDTO> templates = sectionService.getSectionTemplatesByType(sectionType);
        return ResponseEntity.ok(templates);
    }
}