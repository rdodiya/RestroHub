package com.restroly.qrmenu.template.service;

import com.restroly.qrmenu.template.dto.*;
import com.restroly.qrmenu.template.dto.*;

import java.util.List;

public interface SectionService {

    // CRUD operations
    SectionDTO createSection(String siteId, SectionCreateRequest request);

    SectionDTO createSectionFromTemplate(String siteId, Long sectionTemplateId, String sectionKey);

    SectionDTO getSectionById(Long id);

    SectionDTO getSectionByKey(String siteId, String sectionKey);

    List<SectionDTO> getSectionsBySiteId(String siteId);

    List<SectionDTO> getVisibleSectionsBySiteId(String siteId);

    SectionDTO updateSection(Long sectionId, SectionUpdateRequest request);

    SectionDTO updateSectionByKey(String siteId, String sectionKey, SectionUpdateRequest request);

    void deleteSection(Long sectionId);

    void deleteSectionByKey(String siteId, String sectionKey);

    // Reordering
    List<SectionDTO> reorderSections(String siteId, SectionReorderRequest request);

    SectionDTO moveSection(String siteId, String sectionKey, Integer newOrder);

    // Visibility
    SectionDTO toggleVisibility(Long sectionId);

    SectionDTO showSection(Long sectionId);

    SectionDTO hideSection(Long sectionId);

    // Bulk operations
    List<SectionDTO> createMultipleSections(String siteId, List<SectionCreateRequest> requests);

    void deleteAllSections(String siteId);

    // Section templates
    List<SectionTemplateDTO> getAvailableSectionTemplates();

    List<SectionTemplateDTO> getSectionTemplatesByType(String sectionType);
}