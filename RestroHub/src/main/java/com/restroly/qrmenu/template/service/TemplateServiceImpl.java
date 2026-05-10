package com.restroly.qrmenu.template.service;

import com.restroly.qrmenu.common.exception.ResourceAlreadyExistsException;
import com.restroly.qrmenu.common.exception.ResourceNotFoundException;
import com.restroly.qrmenu.template.dto.TemplateCreateRequest;
import com.restroly.qrmenu.template.dto.TemplateDTO;
import com.restroly.qrmenu.template.dto.TemplateUpdateRequest;
import com.restroly.qrmenu.template.entity.Template;
import com.restroly.qrmenu.template.mapper.TemplateMapper;
import com.restroly.qrmenu.template.repository.TemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TemplateServiceImpl implements TemplateService {

    private final TemplateRepository templateRepository;
    private final TemplateMapper templateMapper;

    @Override
    public TemplateDTO createTemplate(TemplateCreateRequest request) {
        log.info("Creating template with key: {}", request.getTemplateKey());

        if (templateRepository.existsByTemplateKey(request.getTemplateKey())) {
            throw new ResourceAlreadyExistsException("Template", "key", request.getTemplateKey());
        }

        Template template = templateMapper.toEntity(request);
        Template savedTemplate = templateRepository.save(template);

        log.info("Template created successfully with id: {}", savedTemplate.getId());
        return templateMapper.toDTO(savedTemplate);
    }

    @Override
    @Transactional(readOnly = true)
    public TemplateDTO getTemplateById(Long id) {
        log.debug("Fetching template by id: {}", id);
        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + id));
        return templateMapper.toDTO(template);
    }

    @Override
    @Transactional(readOnly = true)
    public TemplateDTO getTemplateByKey(String key) {
        log.debug("Fetching template by key: {}", key);
        Template template = templateRepository.findByTemplateKey(key)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with Key : " + key));
        return templateMapper.toDTO(template);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TemplateDTO> getAllTemplates() {
        log.debug("Fetching all templates");
        List<Template> templates = templateRepository.findAll();
        return templateMapper.toDTOList(templates);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TemplateDTO> getActiveTemplates() {
        log.debug("Fetching active templates");
        List<Template> templates = templateRepository.findByIsActiveTrue();
        return templateMapper.toDTOList(templates);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TemplateDTO> getTemplatesByCategory(String category) {
        log.debug("Fetching templates by category: {}", category);
        List<Template> templates = templateRepository.findByCategoryAndIsActiveTrue(category);
        return templateMapper.toDTOList(templates);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TemplateDTO> getTemplatesByFilters(String category, Boolean isPremium) {
        log.debug("Fetching templates with filters - category: {}, isPremium: {}", category, isPremium);
        List<Template> templates = templateRepository.findByFilters(category, isPremium);
        return templateMapper.toDTOList(templates);
    }

    @Override
    public TemplateDTO updateTemplate(Long id, TemplateUpdateRequest request) {
        log.info("Updating template with id: {}", id);

        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + id));

        templateMapper.updateEntity(template, request);
        Template updatedTemplate = templateRepository.save(template);

        log.info("Template updated successfully with id: {}", id);
        return templateMapper.toDTO(updatedTemplate);
    }

    @Override
    public void deleteTemplate(Long id) {
        log.info("Deleting template with id: {}", id);

        if (!templateRepository.existsById(id)) {
            throw new ResourceNotFoundException("Template not found with id: " + id);
        }

        templateRepository.deleteById(id);
        log.info("Template deleted successfully with id: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByTemplateKey(String key) {
        return templateRepository.existsByTemplateKey(key);
    }
}