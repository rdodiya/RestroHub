package com.restroly.qrmenu.template.repository;

import com.restroly.qrmenu.template.entity.SiteConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SiteConfigRepository extends JpaRepository<SiteConfig, Long> {

    Optional<SiteConfig> findBySiteId(String siteId);

    Optional<SiteConfig> findByPageSlug(String pageSlug);

    List<SiteConfig> findByRestaurantId(Long restaurantId);

    Optional<SiteConfig> findBySiteIdAndIsPublishedTrue(String siteId);

    @Query("SELECT sc FROM SiteConfig sc " +
            "JOIN FETCH sc.template " +
            "JOIN FETCH sc.theme " +
            "WHERE sc.siteId = :siteId")
    Optional<SiteConfig> findBySiteIdWithTemplateAndTheme(@Param("siteId") String siteId);

    @Query("SELECT sc FROM SiteConfig sc " +
            "JOIN FETCH sc.template " +
            "JOIN FETCH sc.theme " +
            "WHERE sc.siteId = :siteId AND sc.isPublished = true")
    Optional<SiteConfig> findPublishedBySiteIdWithTemplateAndTheme(@Param("siteId") String siteId);

    boolean existsBySiteId(String siteId);

    List<SiteConfig> findByTemplateId(Long templateId);

    List<SiteConfig> findByThemeId(Long themeId);
}