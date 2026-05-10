package com.restroly.qrmenu.template.controller;

import com.restroly.qrmenu.common.util.ApiConstants;
import com.restroly.qrmenu.template.dto.*;
import com.restroly.qrmenu.template.dto.SectionCreateRequest;
import com.restroly.qrmenu.template.dto.SectionDTO;
import com.restroly.qrmenu.template.dto.SectionReorderRequest;
import com.restroly.qrmenu.template.dto.SectionUpdateRequest;
import com.restroly.qrmenu.template.service.SectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.restroly.qrmenu.common.util.ApiConstants.SECURE_API_VERSION;

@RestController
@RequestMapping(SECURE_API_VERSION+"/admin/sites/{siteId}/sections")
@RequiredArgsConstructor
@Tag(name = "Admin Section Management", description = "APIs for managing site sections")
public class AdminSectionController {

    private final SectionService sectionService;

    @PostMapping
    @Operation(summary = "Create a new section")
    public ResponseEntity<SectionDTO> createSection(
            @Parameter(description = "Site ID") @PathVariable String siteId,
            @Valid @RequestBody SectionCreateRequest request) {
        SectionDTO section = sectionService.createSection(siteId, request);
        return new ResponseEntity<>(section, HttpStatus.CREATED);
    }

    @PostMapping("/from-template/{templateId}")
    @Operation(summary = "Create section from a template")
    public ResponseEntity<SectionDTO> createSectionFromTemplate(
            @Parameter(description = "Site ID") @PathVariable String siteId,
            @Parameter(description = "Section Template ID") @PathVariable Long templateId,
            @Parameter(description = "Section Key") @RequestParam String sectionKey) {
        SectionDTO section = sectionService.createSectionFromTemplate(siteId, templateId, sectionKey);
        return new ResponseEntity<>(section, HttpStatus.CREATED);
    }

    @PostMapping("/bulk")
    @Operation(summary = "Create multiple sections")
    public ResponseEntity<List<SectionDTO>> createMultipleSections(
            @Parameter(description = "Site ID") @PathVariable String siteId,
            @Valid @RequestBody List<SectionCreateRequest> requests) {
        List<SectionDTO> sections = sectionService.createMultipleSections(siteId, requests);
        return new ResponseEntity<>(sections, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all sections for a site")
    public ResponseEntity<List<SectionDTO>> getAllSections(
            @Parameter(description = "Site ID") @PathVariable String siteId) {
        List<SectionDTO> sections = sectionService.getSectionsBySiteId(siteId);
        return ResponseEntity.ok(sections);
    }

    @GetMapping("/visible")
    @Operation(summary = "Get visible sections for a site")
    public ResponseEntity<List<SectionDTO>> getVisibleSections(
            @Parameter(description = "Site ID") @PathVariable String siteId) {
        List<SectionDTO> sections = sectionService.getVisibleSectionsBySiteId(siteId);
        return ResponseEntity.ok(sections);
    }

    @GetMapping("/{sectionKey}")
    @Operation(summary = "Get section by key")
    public ResponseEntity<SectionDTO> getSectionByKey(
            @Parameter(description = "Site ID") @PathVariable String siteId,
            @Parameter(description = "Section Key") @PathVariable String sectionKey) {
        SectionDTO section = sectionService.getSectionByKey(siteId, sectionKey);
        return ResponseEntity.ok(section);
    }

    @PutMapping("/{sectionKey}")
    @Operation(summary = "Update section by key")
    public ResponseEntity<SectionDTO> updateSection(
            @Parameter(description = "Site ID") @PathVariable String siteId,
            @Parameter(description = "Section Key") @PathVariable String sectionKey,
            @Valid @RequestBody SectionUpdateRequest request) {
        SectionDTO section = sectionService.updateSectionByKey(siteId, sectionKey, request);
        return ResponseEntity.ok(section);
    }

    @PutMapping("/{sectionKey}/content")
    @Operation(summary = "Update section content only")
    public ResponseEntity<SectionDTO> updateSectionContent(
            @Parameter(description = "Site ID") @PathVariable String siteId,
            @Parameter(description = "Section Key") @PathVariable String sectionKey,
            @RequestBody java.util.Map<String, Object> content) {
        SectionUpdateRequest request = SectionUpdateRequest.builder()
                .content(content)
                .build();
        SectionDTO section = sectionService.updateSectionByKey(siteId, sectionKey, request);
        return ResponseEntity.ok(section);
    }

    @DeleteMapping("/{sectionKey}")
    @Operation(summary = "Delete section by key")
    public ResponseEntity<Void> deleteSection(
            @Parameter(description = "Site ID") @PathVariable String siteId,
            @Parameter(description = "Section Key") @PathVariable String sectionKey) {
        sectionService.deleteSectionByKey(siteId, sectionKey);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    @Operation(summary = "Delete all sections for a site")
    public ResponseEntity<Void> deleteAllSections(
            @Parameter(description = "Site ID") @PathVariable String siteId) {
        sectionService.deleteAllSections(siteId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reorder")
    @Operation(summary = "Reorder sections")
    public ResponseEntity<List<SectionDTO>> reorderSections(
            @Parameter(description = "Site ID") @PathVariable String siteId,
            @Valid @RequestBody SectionReorderRequest request) {
        List<SectionDTO> sections = sectionService.reorderSections(siteId, request);
        return ResponseEntity.ok(sections);
    }

    @PutMapping("/{sectionKey}/move")
    @Operation(summary = "Move section to a new position")
    public ResponseEntity<SectionDTO> moveSection(
            @Parameter(description = "Site ID") @PathVariable String siteId,
            @Parameter(description = "Section Key") @PathVariable String sectionKey,
            @Parameter(description = "New order position") @RequestParam Integer newOrder) {
        SectionDTO section = sectionService.moveSection(siteId, sectionKey, newOrder);
        return ResponseEntity.ok(section);
    }

    @PutMapping("/id/{sectionId}/toggle-visibility")
    @Operation(summary = "Toggle section visibility")
    public ResponseEntity<SectionDTO> toggleVisibility(
            @PathVariable String siteId,
            @Parameter(description = "Section ID") @PathVariable Long sectionId) {
        SectionDTO section = sectionService.toggleVisibility(sectionId);
        return ResponseEntity.ok(section);
    }

    @PutMapping("/id/{sectionId}/show")
    @Operation(summary = "Show section")
    public ResponseEntity<SectionDTO> showSection(
            @PathVariable String siteId,
            @Parameter(description = "Section ID") @PathVariable Long sectionId) {
        SectionDTO section = sectionService.showSection(sectionId);
        return ResponseEntity.ok(section);
    }

    @PutMapping("/id/{sectionId}/hide")
    @Operation(summary = "Hide section")
    public ResponseEntity<SectionDTO> hideSection(
            @PathVariable String siteId,
            @Parameter(description = "Section ID") @PathVariable Long sectionId) {
        SectionDTO section = sectionService.hideSection(sectionId);
        return ResponseEntity.ok(section);
    }
}