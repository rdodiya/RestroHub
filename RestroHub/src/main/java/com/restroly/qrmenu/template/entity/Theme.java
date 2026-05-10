package com.restroly.qrmenu.template.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

// -------------------------
// Theme (generic tokens)
// Keep tokens flexible but still explicit.
// You can add more fields later OR move to JSON if you want fully dynamic tokens.
// -------------------------



import java.time.LocalDateTime;

@Entity
@Table(name = "themes", indexes = {
        @Index(name = "idx_theme_key", columnList = "theme_key")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Theme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "theme_key", nullable = false, unique = true)
    private String themeKey; // OCEAN_BLUE, SUNSET_ORANGE, FOREST_GREEN

    @Column(length = 500)
    private String description;

    // ========== Color Palette ==========

    // Primary Colors
    @Column(name = "primary_color", nullable = false, length = 20)
    private String primaryColor;        // #f59e0b

    @Column(name = "color_primary_hover", length = 20)
    private String colorPrimaryHover;   // #fbbf24

    @Column(name = "color_primary_dark", length = 20)
    private String colorPrimaryDark;    // #d97706

    @Column(name = "secondary_color", length = 20)
    private String secondaryColor;

    @Column(name = "color_accent", length = 20)
    private String colorAccent;

    // Background Colors
    @Column(name = "bg_primary", length = 20)
    private String bgPrimary;           // #000000

    @Column(name = "bg_secondary", length = 20)
    private String bgSecondary;         // #0a0a0a

    @Column(name = "bg_tertiary", length = 20)
    private String bgTertiary;          // #171717

    // Text Colors
    @Column(name = "primary_text_color", length = 20)
    private String PrimaryTextColor;         // #ffffff

    @Column(name = "secondary_text_color", length = 20)
    private String secondaryTextColor;       // #9ca3af

    @Column(name = "text_muted", length = 20)
    private String textMuted;           // #6b7280

    // Component Colors
    @Column(name = "header_bg", length = 20)
    private String headerBackground;

    @Column(name = "footer_bg", length = 20)
    private String footerBackground;

    @Column(name = "button_bg", length = 20)
    private String buttonBackground;

    @Column(name = "button_text", length = 20)
    private String buttonText;

    @Column(name = "border_color", length = 20)
    private String borderColor;

    // ========== Typography ==========

    @Column(name = "font_primary", length = 100)
    private String fontPrimary;         // "Inter, sans-serif"

    @Column(name = "font_heading", length = 100)
    private String fontHeading;         // "Playfair Display, serif"

    @Column(name = "font_size_base", length = 20)
    private String fontSizeBase;        // "16px"

    // ========== Additional Styles (JSON for flexibility) ==========

    @Column(name = "custom_styles", columnDefinition = "TEXT")
    private String customStylesJson;    // Additional CSS variables or styles

    // ========== Status ==========

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "is_default")
    @Builder.Default
    private Boolean isDefault = false;

    @Column(name = "is_dark_mode")
    @Builder.Default
    private Boolean isDarkMode = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}