package com.restroly.qrmenu.template.entity;

import com.restroly.qrmenu.menu.entity.Menu;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "t_site_config")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Public website id
     * Example:
     * spice-villa
     */
    @Column(name = "site_id", nullable = false, unique = true, length = 100)
    private String siteId;

    @Column(name = "restaurant_id", nullable = false)
    private Long restaurantId;

    @Column(name = "site_name", length = 150)
    private String siteName;

    @Column(name = "page_slug", unique = true, length = 150)
    private String pageSlug;

    /**
     * React Template
     * Example:
     * luxury_v1
     * modern_v2
     */
    @Column(name = "template_key", nullable = false, length = 100)
    private String templateKey;

    @OneToOne(
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    @JoinColumn(name = "theme_id")
    private Theme theme;

    /**
     * Existing Menu Module
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_id")
    private Menu menu;

    /**
     * Editable Website Sections
     */
    @OneToMany(
            mappedBy = "siteConfig",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @OrderBy("displayOrder ASC")
    @Builder.Default
    private List<Section> sections = new ArrayList<>();

    @Builder.Default
    @Column(name = "is_published")
    private Boolean isPublished = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public void addSection(Section section) {
        sections.add(section);
        section.setSiteConfig(this);
    }

    public void removeSection(Section section) {
        sections.remove(section);
        section.setSiteConfig(null);
    }
}