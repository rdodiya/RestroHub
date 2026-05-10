package com.restroly.qrmenu.template.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Predefined section templates that can be used across multiple sites
 */
@Entity
@Table(name = "section_templates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SectionTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "template_key", unique = true, nullable = false, length = 50)
    private String templateKey; // e.g., "hero_centered", "hero_split", "menu_grid"

    @Column(name = "section_type", nullable = false, length = 50)
    private String sectionType; // e.g., "hero", "menu", "about", "gallery"

    @Column(name = "react_component_name", nullable = false, length = 100)
    private String reactComponentName;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "preview_image_url", length = 255)
    private String previewImageUrl;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "default_content", columnDefinition = "jsonb")
    private Map<String, Object> defaultContent; // Default content structure

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "default_settings", columnDefinition = "jsonb")
    private Map<String, Object> defaultSettings;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "schema", columnDefinition = "jsonb")
    private Map<String, Object> schema; // JSON schema for content validation

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "is_premium")
    @Builder.Default
    private Boolean isPremium = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}