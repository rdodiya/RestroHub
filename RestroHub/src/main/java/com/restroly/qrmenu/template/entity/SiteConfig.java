package com.restroly.qrmenu.template.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "t_siteconfig_master")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "site_id", unique = true, nullable = false, length = 50)
    private String siteId;

    @Column(name = "site_name", length = 100)
    private String siteName;

    @Column(name = "page_slug", length = 100)
    private String pageSlug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private Template template;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "theme_id", nullable = false)
    private Theme theme;

    @OneToMany(mappedBy = "siteConfig", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    @Builder.Default
    private List<Section> sections = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "brand_data", columnDefinition = "jsonb")
    private Map<String, Object> brandData; // Brand info: name, logo, tagline, etc.

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "navigation", columnDefinition = "jsonb")
    private List<Map<String, Object>> navigation; // Navigation links

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "social_links", columnDefinition = "jsonb")
    private List<Map<String, Object>> socialLinks;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "footer_data", columnDefinition = "jsonb")
    private Map<String, Object> footerData;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "meta_data", columnDefinition = "jsonb")
    private Map<String, Object> metaData; // SEO, social meta, etc.

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "global_settings", columnDefinition = "jsonb")
    private Map<String, Object> globalSettings; // Site-wide settings

    @Column(name = "is_published")
    @Builder.Default
    private Boolean isPublished = false;

    @Column(name = "restaurant_id")
    private Long restaurantId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Helper method to add section
    public void addSection(Section section) {
        sections.add(section);
        section.setSiteConfig(this);
    }

    // Helper method to remove section
    public void removeSection(Section section) {
        sections.remove(section);
        section.setSiteConfig(null);
    }

}