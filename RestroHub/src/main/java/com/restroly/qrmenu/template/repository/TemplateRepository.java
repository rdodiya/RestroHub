package com.restroly.qrmenu.template.repository;

import com.restroly.qrmenu.template.entity.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TemplateRepository extends JpaRepository<Template, Long> {

    Optional<Template> findByTemplateKey(String key);

    Optional<Template> findByReactComponentName(String reactComponentName);

    List<Template> findByIsActiveTrue();

    List<Template> findByCategory(String category);

    List<Template> findByCategoryAndIsActiveTrue(String category);

    @Query("SELECT t FROM Template t WHERE t.isActive = true AND " +
            "(:category IS NULL OR t.category = :category) AND " +
            "(:isPremium IS NULL OR t.isPremium = :isPremium)")
    List<Template> findByFilters(@Param("category") String category,
                                 @Param("isPremium") Boolean isPremium);

    boolean existsByTemplateKey(String key);
}