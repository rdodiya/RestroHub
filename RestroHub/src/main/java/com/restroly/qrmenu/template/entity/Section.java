package com.restroly.qrmenu.template.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "t_section_master")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Section {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "section_key", nullable = false, length = 50)
    private SectionType sectionKey;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @Builder.Default
    @Column(name = "is_visible")
    private Boolean isVisible = true;

    /**
     * Editable content.
     *
     * Hero
     * About
     * Contact
     * Gallery
     * Footer
     * Navigation
     * Reservation
     * Service FAB
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "content")
    private Map<String, Object> content;

    /**
     * Section specific styles.
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "styles")
    private Map<String, Object> styles;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_config_id", nullable = false)
    private SiteConfig siteConfig;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}