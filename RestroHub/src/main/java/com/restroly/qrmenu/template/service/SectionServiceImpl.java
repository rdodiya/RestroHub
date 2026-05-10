package com.restroly.qrmenu.template.service;

import com.restroly.qrmenu.common.exception.ResourceAlreadyExistsException;
import com.restroly.qrmenu.common.exception.ResourceNotFoundException;
import com.restroly.qrmenu.template.dto.*;
import com.restroly.qrmenu.template.dto.*;
import com.restroly.qrmenu.template.entity.Section;
import com.restroly.qrmenu.template.entity.SectionTemplate;
import com.restroly.qrmenu.template.entity.SiteConfig;
import com.restroly.qrmenu.template.mapper.SectionMapper;
import com.restroly.qrmenu.template.mapper.SectionTemplateMapper;
import com.restroly.qrmenu.template.repository.SectionRepository;
import com.restroly.qrmenu.template.repository.SectionTemplateRepository;
import com.restroly.qrmenu.template.repository.SiteConfigRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SectionServiceImpl implements SectionService {

    private final SectionRepository sectionRepository;
    private final SectionTemplateRepository sectionTemplateRepository;
    private final SiteConfigRepository siteConfigRepository;
    private final SectionMapper sectionMapper;
    private final SectionTemplateMapper sectionTemplateMapper;

    @Override
    @CacheEvict(value = "siteConfigs", key = "#siteId")
    public SectionDTO createSection(String siteId, SectionCreateRequest request) {
        log.info("Creating section '{}' for siteId: {}", request.getSectionKey(), siteId);

        SiteConfig siteConfig = siteConfigRepository.findBySiteId(siteId)
                .orElseThrow(() -> new ResourceNotFoundException("Site config not found with siteId : "+ siteId));

        // Check for duplicate section key
        if (sectionRepository.existsBySiteConfigIdAndSectionKey(siteConfig.getId(), request.getSectionKey())) {
            throw new ResourceAlreadyExistsException("Section", "sectionKey", request.getSectionKey());
        }

        // Determine display order
        Integer displayOrder = request.getDisplayOrder();
        if (displayOrder == null) {
            displayOrder = sectionRepository.findMaxDisplayOrderBySiteConfigId(siteConfig.getId()) + 1;
        } else {
            // Shift existing sections if inserting at specific position
            sectionRepository.incrementDisplayOrderFrom(siteConfig.getId(), displayOrder);
        }

        Section section = sectionMapper.toEntity(request, siteConfig, displayOrder);
        Section savedSection = sectionRepository.save(section);

        log.info("Section created successfully with id: {}", savedSection.getId());
        return sectionMapper.toDTO(savedSection);
    }

    @Override
    @CacheEvict(value = "siteConfigs", key = "#siteId")
    public SectionDTO createSectionFromTemplate(String siteId, Long sectionTemplateId, String sectionKey) {
        log.info("Creating section from template {} for siteId: {}", sectionTemplateId, siteId);

        SiteConfig siteConfig = siteConfigRepository.findBySiteId(siteId)
                .orElseThrow(() -> new  ResourceNotFoundException("Site config not found with siteId : "+ siteId));

        SectionTemplate template = sectionTemplateRepository.findById(sectionTemplateId)
                .orElseThrow(() -> new RuntimeException("Section template not found: " + sectionTemplateId));

        // Check for duplicate section key
        if (sectionRepository.existsBySiteConfigIdAndSectionKey(siteConfig.getId(), sectionKey)) {
            throw new ResourceAlreadyExistsException("Section", "sectionKey", sectionKey);
        }

        Integer displayOrder = sectionRepository.findMaxDisplayOrderBySiteConfigId(siteConfig.getId()) + 1;

        Section section = sectionMapper.toEntityFromTemplate(template, siteConfig, sectionKey, displayOrder);
        Section savedSection = sectionRepository.save(section);

        log.info("Section created from template successfully with id: {}", savedSection.getId());
        return sectionMapper.toDTO(savedSection);
    }

    @Override
    @Transactional(readOnly = true)
    public SectionDTO getSectionById(Long id) {
        log.debug("Fetching section by id: {}", id);
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found with id: " + id));
        return sectionMapper.toDTO(section);
    }

    @Override
    @Transactional(readOnly = true)
    public SectionDTO getSectionByKey(String siteId, String sectionKey) {
        log.debug("Fetching section by key: {} for siteId: {}", sectionKey, siteId);
        Section section = sectionRepository.findBySiteConfigSiteIdAndSectionKey(siteId, sectionKey)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found with sectionKey : " + sectionKey));
        return sectionMapper.toDTO(section);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SectionDTO> getSectionsBySiteId(String siteId) {
        log.debug("Fetching all sections for siteId: {}", siteId);
        List<Section> sections = sectionRepository.findBySiteConfigSiteIdOrderByDisplayOrderAsc(siteId);
        return sectionMapper.toDTOList(sections);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SectionDTO> getVisibleSectionsBySiteId(String siteId) {
        log.debug("Fetching visible sections for siteId: {}", siteId);
        List<Section> sections = sectionRepository.findBySiteConfigSiteIdAndIsVisibleTrueOrderByDisplayOrderAsc(siteId);
        return sectionMapper.toDTOList(sections);
    }

    @Override
    @CacheEvict(value = "siteConfigs", allEntries = true)
    public SectionDTO updateSection(Long sectionId, SectionUpdateRequest request) {
        log.info("Updating section with id: {}", sectionId);

        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found with id: " + sectionId));

        sectionMapper.updateEntity(section, request);
        Section updatedSection = sectionRepository.save(section);

        log.info("Section updated successfully with id: {}", sectionId);
        return sectionMapper.toDTO(updatedSection);
    }

    @Override
    @CacheEvict(value = "siteConfigs", key = "#siteId")
    public SectionDTO updateSectionByKey(String siteId, String sectionKey, SectionUpdateRequest request) {
        log.info("Updating section '{}' for siteId: {}", sectionKey, siteId);

        Section section = sectionRepository.findBySiteConfigSiteIdAndSectionKey(siteId, sectionKey)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found with sectionKey : " + sectionKey));

        sectionMapper.updateEntity(section, request);
        Section updatedSection = sectionRepository.save(section);

        log.info("Section updated successfully");
        return sectionMapper.toDTO(updatedSection);
    }

    @Override
    @CacheEvict(value = "siteConfigs", allEntries = true)
    public void deleteSection(Long sectionId) {
        log.info("Deleting section with id: {}", sectionId);

        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found with id: " + sectionId));

        Long siteConfigId = section.getSiteConfig().getId();
        Integer deletedOrder = section.getDisplayOrder();

        sectionRepository.delete(section);

        // Reorder remaining sections
        sectionRepository.decrementDisplayOrderFrom(siteConfigId, deletedOrder);

        log.info("Section deleted successfully with id: {}", sectionId);
    }

    @Override
    @CacheEvict(value = "siteConfigs", key = "#siteId")
    public void deleteSectionByKey(String siteId, String sectionKey) {
        log.info("Deleting section '{}' for siteId: {}", sectionKey, siteId);

        Section section = sectionRepository.findBySiteConfigSiteIdAndSectionKey(siteId, sectionKey)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found with sectionKey : " + sectionKey));

        Long siteConfigId = section.getSiteConfig().getId();
        Integer deletedOrder = section.getDisplayOrder();

        sectionRepository.delete(section);
        sectionRepository.decrementDisplayOrderFrom(siteConfigId, deletedOrder);

        log.info("Section deleted successfully");
    }

    @Override
    @CacheEvict(value = "siteConfigs", key = "#siteId")
    public List<SectionDTO> reorderSections(String siteId, SectionReorderRequest request) {
        log.info("Reordering sections for siteId: {}", siteId);

        for (SectionReorderRequest.SectionOrderItem item : request.getSections()) {
            Section section = sectionRepository.findById(item.getSectionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Section not found with id: " + item.getSectionId()));
            section.setDisplayOrder(item.getDisplayOrder());
            sectionRepository.save(section);
        }

        return getSectionsBySiteId(siteId);
    }

    @Override
    @CacheEvict(value = "siteConfigs", key = "#siteId")
    public SectionDTO moveSection(String siteId, String sectionKey, Integer newOrder) {
        log.info("Moving section '{}' to order {} for siteId: {}", sectionKey, newOrder, siteId);

        Section section = sectionRepository.findBySiteConfigSiteIdAndSectionKey(siteId, sectionKey)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found with sectionKey : " + sectionKey));

        Integer oldOrder = section.getDisplayOrder();
        Long siteConfigId = section.getSiteConfig().getId();

        if (newOrder > oldOrder) {
            // Moving down - decrement orders between old and new
            sectionRepository.decrementDisplayOrderFrom(siteConfigId, oldOrder);
            sectionRepository.incrementDisplayOrderFrom(siteConfigId, newOrder + 1);
        } else if (newOrder < oldOrder) {
            // Moving up - increment orders between new and old
            sectionRepository.incrementDisplayOrderFrom(siteConfigId, newOrder);
        }

        section.setDisplayOrder(newOrder);
        Section updatedSection = sectionRepository.save(section);

        return sectionMapper.toDTO(updatedSection);
    }

    @Override
    @CacheEvict(value = "siteConfigs", allEntries = true)
    public SectionDTO toggleVisibility(Long sectionId) {
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found with id: " + sectionId));
        section.setIsVisible(!section.getIsVisible());
        return sectionMapper.toDTO(sectionRepository.save(section));
    }

    @Override
    @CacheEvict(value = "siteConfigs", allEntries = true)
    public SectionDTO showSection(Long sectionId) {
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found with id: " + sectionId));
        section.setIsVisible(true);
        return sectionMapper.toDTO(sectionRepository.save(section));
    }

    @Override
    @CacheEvict(value = "siteConfigs", allEntries = true)
    public SectionDTO hideSection(Long sectionId) {
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found with id: " + sectionId));
        section.setIsVisible(false);
        return sectionMapper.toDTO(sectionRepository.save(section));
    }

    @Override
    @CacheEvict(value = "siteConfigs", key = "#siteId")
    public List<SectionDTO> createMultipleSections(String siteId, List<SectionCreateRequest> requests) {
        log.info("Creating {} sections for siteId: {}", requests.size(), siteId);

        List<SectionDTO> createdSections = new ArrayList<>();
        for (SectionCreateRequest request : requests) {
            createdSections.add(createSection(siteId, request));
        }

        return createdSections;
    }

    @Override
    @CacheEvict(value = "siteConfigs", key = "#siteId")
    public void deleteAllSections(String siteId) {
        log.info("Deleting all sections for siteId: {}", siteId);

        SiteConfig siteConfig = siteConfigRepository.findBySiteId(siteId)
                .orElseThrow(() -> new  ResourceNotFoundException("Site config not found with siteId : "+ siteId));

        sectionRepository.deleteBySiteConfigId(siteConfig.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SectionTemplateDTO> getAvailableSectionTemplates() {
        List<SectionTemplate> templates = sectionTemplateRepository.findByIsActiveTrue();
        return sectionTemplateMapper.toDTOList(templates);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SectionTemplateDTO> getSectionTemplatesByType(String sectionType) {
        List<SectionTemplate> templates = sectionTemplateRepository.findBySectionTypeAndIsActiveTrue(sectionType);
        return sectionTemplateMapper.toDTOList(templates);
    }
}