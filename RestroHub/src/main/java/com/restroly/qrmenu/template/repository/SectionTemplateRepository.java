package com.restroly.qrmenu.template.repository;

import com.restroly.qrmenu.template.entity.SectionTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SectionTemplateRepository extends JpaRepository<SectionTemplate, Long> {

    Optional<SectionTemplate> findByTemplateKey(String templateKey);

    List<SectionTemplate> findBySectionType(String sectionType);

    List<SectionTemplate> findByIsActiveTrue();

    List<SectionTemplate> findBySectionTypeAndIsActiveTrue(String sectionType);

    List<SectionTemplate> findByIsPremiumFalseAndIsActiveTrue();

    boolean existsByTemplateKey(String templateKey);
}