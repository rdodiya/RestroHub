package com.restroly.qrmenu.template.repository;

import com.restroly.qrmenu.template.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {

    List<Section> findBySiteConfigIdOrderByDisplayOrderAsc(Long siteConfigId);

    List<Section> findBySiteConfigIdAndIsVisibleTrueOrderByDisplayOrderAsc(Long siteConfigId);

    List<Section> findBySiteConfigSiteIdOrderByDisplayOrderAsc(String siteId);

    List<Section> findBySiteConfigSiteIdAndIsVisibleTrueOrderByDisplayOrderAsc(String siteId);

    Optional<Section> findBySiteConfigIdAndSectionKey(Long siteConfigId, String sectionKey);

    Optional<Section> findBySiteConfigSiteIdAndSectionKey(String siteId, String sectionKey);

    List<Section> findBySectionType(String sectionType);

    @Query("SELECT COALESCE(MAX(s.displayOrder), 0) FROM Section s WHERE s.siteConfig.id = :siteConfigId")
    Integer findMaxDisplayOrderBySiteConfigId(@Param("siteConfigId") Long siteConfigId);

    @Modifying
    @Query("UPDATE Section s SET s.displayOrder = s.displayOrder + 1 " +
            "WHERE s.siteConfig.id = :siteConfigId AND s.displayOrder >= :fromOrder")
    void incrementDisplayOrderFrom(@Param("siteConfigId") Long siteConfigId,
                                   @Param("fromOrder") Integer fromOrder);

    @Modifying
    @Query("UPDATE Section s SET s.displayOrder = s.displayOrder - 1 " +
            "WHERE s.siteConfig.id = :siteConfigId AND s.displayOrder > :fromOrder")
    void decrementDisplayOrderFrom(@Param("siteConfigId") Long siteConfigId,
                                   @Param("fromOrder") Integer fromOrder);

    void deleteBySiteConfigId(Long siteConfigId);

    boolean existsBySiteConfigIdAndSectionKey(Long siteConfigId, String sectionKey);
}