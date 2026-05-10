package com.restroly.qrmenu.template.service;

import com.restroly.qrmenu.template.dto.PublicSiteConfigResponse;
import com.restroly.qrmenu.template.dto.SiteConfigCreateRequest;
import com.restroly.qrmenu.template.dto.SiteConfigDTO;
import com.restroly.qrmenu.template.dto.SiteConfigUpdateRequest;

import java.util.List;

public interface SiteConfigService {

    SiteConfigDTO createSiteConfig(SiteConfigCreateRequest request);

    SiteConfigDTO getSiteConfigById(Long id);

    SiteConfigDTO getSiteConfigBySiteId(String siteId);

    List<SiteConfigDTO> getSiteConfigsByRestaurantId(Long restaurantId);

    List<SiteConfigDTO> getAllSiteConfigs();

    SiteConfigDTO updateSiteConfig(String siteId, SiteConfigUpdateRequest request);

    void deleteSiteConfig(String siteId);

    // Public API for React frontend
    PublicSiteConfigResponse getPublicSiteConfig(String siteId);

    SiteConfigDTO publishSiteConfig(String siteId);

    SiteConfigDTO unpublishSiteConfig(String siteId);

    boolean existsBySiteId(String siteId);
}