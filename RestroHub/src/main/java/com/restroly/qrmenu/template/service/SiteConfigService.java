package com.restroly.qrmenu.template.service;

import com.restroly.qrmenu.template.dto.SiteConfigDTO;
import com.restroly.qrmenu.template.dto.UpdateSiteConfigRequest;

import java.util.List;

public interface SiteConfigService {

    // Public API for React frontend
    SiteConfigDTO getPublicSiteConfig(String siteId);

    SiteConfigDTO updateSiteConfig(String siteId, UpdateSiteConfigRequest request);
}