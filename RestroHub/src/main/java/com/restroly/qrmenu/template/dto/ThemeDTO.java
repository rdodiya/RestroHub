package com.restroly.qrmenu.template.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThemeDTO {

    // ========= Basic Info =========
    private Long id;
    private String name;
    private String themeKey;
    private String description;

    // ========= Primary Colors =========
    private String primaryColor;
    private String colorPrimaryHover;
    private String colorPrimaryDark;
    private String secondaryColor;
    private String colorAccent;

    // ========= Background Colors =========
    private String bgPrimary;
    private String bgSecondary;
    private String bgTertiary;

    // ========= Text Colors =========
    private String primaryTextColor;
    private String secondaryTextColor;
    private String textMuted;

    // ========= Component Colors =========
    private String headerBackground;
    private String footerBackground;
    private String buttonBackground;
    private String buttonText;
    private String borderColor;

    // ========= Typography =========
    private String fontPrimary;
    private String fontHeading;
    private String fontSizeBase;

    // ========= Additional Styles =========
    private String customStylesJson;

    // ========= Status =========
    private Boolean isActive;
    private Boolean isDefault;
    private Boolean isDarkMode;

    // ========= Audit =========
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
