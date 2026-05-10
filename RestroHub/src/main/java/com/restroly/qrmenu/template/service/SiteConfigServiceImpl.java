package com.restroly.qrmenu.template.service;

import com.restroly.qrmenu.common.exception.ResourceAlreadyExistsException;
import com.restroly.qrmenu.common.exception.ResourceNotFoundException;
import com.restroly.qrmenu.template.dto.PublicSiteConfigResponse;
import com.restroly.qrmenu.template.dto.SiteConfigCreateRequest;
import com.restroly.qrmenu.template.dto.SiteConfigDTO;
import com.restroly.qrmenu.template.dto.SiteConfigUpdateRequest;
import com.restroly.qrmenu.template.entity.SiteConfig;
import com.restroly.qrmenu.template.entity.Template;
import com.restroly.qrmenu.template.entity.Theme;
import com.restroly.qrmenu.template.mapper.SiteConfigMapper;
import com.restroly.qrmenu.template.repository.SiteConfigRepository;
import com.restroly.qrmenu.template.repository.TemplateRepository;
import com.restroly.qrmenu.template.repository.ThemeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SiteConfigServiceImpl implements SiteConfigService {

    private final SiteConfigRepository siteConfigRepository;
    private final TemplateRepository templateRepository;
    private final ThemeRepository themeRepository;
    private final SiteConfigMapper siteConfigMapper;

    @Override
    public SiteConfigDTO createSiteConfig(SiteConfigCreateRequest request) {
        log.info("Creating site config for siteId: {}", request.getSiteId());

        if (siteConfigRepository.existsBySiteId(request.getSiteId())) {
            throw new ResourceAlreadyExistsException("SiteConfig", "siteId", request.getSiteId());
        }

        Template template = templateRepository.findById(request.getTemplateId())
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + request.getTemplateId()));

        Theme theme = themeRepository.findById(request.getThemeId())
                .orElseThrow(() -> new ResourceNotFoundException("Theme not found with id: " + request.getThemeId()));

        SiteConfig siteConfig = siteConfigMapper.toEntity(request, template, theme);
        SiteConfig savedConfig = siteConfigRepository.save(siteConfig);

        log.info("Site config created successfully for siteId: {}", request.getSiteId());
        return siteConfigMapper.toDTO(savedConfig);
    }

    @Override
    @Transactional(readOnly = true)
    public SiteConfigDTO getSiteConfigById(Long id) {
        log.debug("Fetching site config by id: {}", id);
        SiteConfig siteConfig = siteConfigRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Site config not found with id : "+ id));
        return siteConfigMapper.toDTO(siteConfig);
    }

    @Override
    @Transactional(readOnly = true)
    public SiteConfigDTO getSiteConfigBySiteId(String siteId) {
        log.debug("Fetching site config by siteId: {}", siteId);
        SiteConfig siteConfig = siteConfigRepository.findBySiteIdWithTemplateAndTheme(siteId)
                .orElseThrow(() -> new ResourceNotFoundException("Site config not found with siteId : "+ siteId));
        return siteConfigMapper.toDTO(siteConfig);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SiteConfigDTO> getSiteConfigsByRestaurantId(Long restaurantId) {
        log.debug("Fetching site configs for restaurantId: {}", restaurantId);
        List<SiteConfig> configs = siteConfigRepository.findByRestaurantId(restaurantId);
        return siteConfigMapper.toDTOList(configs);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SiteConfigDTO> getAllSiteConfigs() {
        log.debug("Fetching all site configs");
        List<SiteConfig> configs = siteConfigRepository.findAll();
        return siteConfigMapper.toDTOList(configs);
    }

    @Override
    @CacheEvict(value = "siteConfigs", key = "#siteId")
    public SiteConfigDTO updateSiteConfig(String siteId, SiteConfigUpdateRequest request) {
        log.info("Updating site config for siteId: {}", siteId);

        SiteConfig siteConfig = siteConfigRepository.findBySiteId(siteId)
                .orElseThrow(() -> new ResourceNotFoundException("Site config not found with siteId : "+ siteId));

        Template template = null;
        if (request.getTemplateId() != null) {
            template = templateRepository.findById(request.getTemplateId())
                    .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + request.getTemplateId()));
        }

        Theme theme = null;
        if (request.getThemeId() != null) {
            theme = themeRepository.findById(request.getThemeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Theme not found with id: " + request.getThemeId()));
        }

        siteConfigMapper.updateEntity(siteConfig, request, template, theme);
        SiteConfig updatedConfig = siteConfigRepository.save(siteConfig);

        log.info("Site config updated successfully for siteId: {}", siteId);
        return siteConfigMapper.toDTO(updatedConfig);
    }

    @Override
    @CacheEvict(value = "siteConfigs", key = "#siteId")
    public void deleteSiteConfig(String siteId) {
        log.info("Deleting site config for siteId: {}", siteId);

        SiteConfig siteConfig = siteConfigRepository.findBySiteId(siteId)
                .orElseThrow(() -> new ResourceNotFoundException("Site config not found with siteId : "+ siteId));

        siteConfigRepository.delete(siteConfig);
        log.info("Site config deleted successfully for siteId: {}", siteId);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "siteConfigs", key = "#siteId")
    public PublicSiteConfigResponse getPublicSiteConfig(String siteId) {
        log.debug("Fetching public site config for siteId: {}", siteId);

        SiteConfig siteConfig = siteConfigRepository.findPublishedBySiteIdWithTemplateAndTheme(siteId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Published site config not found for siteId: " + siteId));

        return siteConfigMapper.toPublicResponse(siteConfig);
    }

    @Override
    @CacheEvict(value = "siteConfigs", key = "#siteId")
    public SiteConfigDTO publishSiteConfig(String siteId) {
        log.info("Publishing site config for siteId: {}", siteId);

        SiteConfig siteConfig = siteConfigRepository.findBySiteId(siteId)
                .orElseThrow(() -> new ResourceNotFoundException("Site config not found with siteId : "+ siteId));

        siteConfig.setIsPublished(true);
        SiteConfig savedConfig = siteConfigRepository.save(siteConfig);

        log.info("Site config published successfully for siteId: {}", siteId);
        return siteConfigMapper.toDTO(savedConfig);
    }

    @Override
    @CacheEvict(value = "siteConfigs", key = "#siteId")
    public SiteConfigDTO unpublishSiteConfig(String siteId) {
        log.info("Unpublishing site config for siteId: {}", siteId);

        SiteConfig siteConfig = siteConfigRepository.findBySiteId(siteId)
                .orElseThrow(() -> new ResourceNotFoundException("Site config not found with siteId : "+ siteId));

        siteConfig.setIsPublished(false);
        SiteConfig savedConfig = siteConfigRepository.save(siteConfig);

        log.info("Site config unpublished successfully for siteId: {}", siteId);
        return siteConfigMapper.toDTO(savedConfig);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsBySiteId(String siteId) {
        return siteConfigRepository.existsBySiteId(siteId);
    }
}