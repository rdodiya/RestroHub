package com.restroly.qrmenu.template.entity;

// ============================================
// Generic + Scalable Website Builder Model
// - Template: which React template to render
// - Theme: design tokens (colors, etc.)
// - RestaurantAppearance: per-restaurant selected template/theme + dynamic sections
// - Sections are dynamic via a Section registry pattern:
//      RestaurantSection (base) + concrete section entities (Brand/About/Contact/Social/Gallery)
// Add/remove sections without changing RestaurantAppearance schema.
// ============================================


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;


// -------------------------
// Template
// -------------------------
@Entity
@Table(
        name = "t_template_master",
        uniqueConstraints = @UniqueConstraint(name = "uk_template_key", columnNames = "template_key")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Template {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="template_key", nullable=false, length=80)
    private String templateKey; // React registry key (e.g. "adk_v1")

    @Column(name = "react_component_name", nullable = false, length = 100)
    private String reactComponentName;

    @Column(nullable=false, length=120)
    private String name;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name="preview_image_url")
    private String previewImageUrl;

    @Column(name = "category", length = 50)
    private String category; // e.g., "landing", "menu", "about"

    // Default configuration for this template (JSON)
    @Column(name = "default_config", columnDefinition = "TEXT")
    private String defaultConfigJson;

    @Column(name = "is_premium")
    @Builder.Default
    private Boolean isPremium = false;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}