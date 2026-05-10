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

@Entity
@Table(name = "t_sections_master")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Section {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "section_key", nullable = false, length = 50)
    private String sectionKey; // e.g., "hero", "about", "menu", "gallery", "contact"

    @Column(name = "section_type", nullable = false, length = 50)
    private String sectionType; // e.g., "hero_v1", "hero_v2", "menu_grid", "menu_list"

    @Column(name = "react_component_name", nullable = false, length = 100)
    private String reactComponentName; // e.g., "HeroSection", "MenuGridSection"

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @Column(name = "title", length = 200)
    private String title;

    @Column(name = "subtitle", length = 300)
    private String subtitle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_config_id", nullable = false)
    private SiteConfig siteConfig;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "content", columnDefinition = "jsonb")
    private Map<String, Object> content; // Section-specific content

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "settings", columnDefinition = "jsonb")
    private Map<String, Object> settings; // Section-specific settings (layout, animations, etc.)

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "style_overrides", columnDefinition = "jsonb")
    private Map<String, Object> styleOverrides; // Custom CSS overrides for this section

    @Column(name = "background_image", length = 500)
    private String backgroundImage;

    @Column(name = "background_color", length = 20)
    private String backgroundColor;

    @Column(name = "is_visible")
    @Builder.Default
    private Boolean isVisible = true;

    @Column(name = "is_full_width")
    @Builder.Default
    private Boolean isFullWidth = true;

    @Column(name = "padding_top", length = 20)
    private String paddingTop;

    @Column(name = "padding_bottom", length = 20)
    private String paddingBottom;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}