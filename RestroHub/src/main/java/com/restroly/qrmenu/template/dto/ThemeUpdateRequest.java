package com.restroly.qrmenu.template.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThemeUpdateRequest {

    @Size(max = 100, message = "Theme name must not exceed 100 characters")
    private String name;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
            message = "Primary color must be a valid hex color")
    private String primaryColor;

    @Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
            message = "Secondary color must be a valid hex color")
    private String secondaryColor;

    @Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
            message = "Background color must be a valid hex color")
    private String backgroundColor;

    @Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
            message = "Text color must be a valid hex color")
    private String textColor;

    private String accentColor;
    private String headerBgColor;
    private String footerBgColor;
    private String fontFamily;
    private String headingFontFamily;
    private String borderRadius;
    private String buttonStyle;
    private Boolean isDarkMode;
    private Boolean isActive;
    private Boolean isDefault;
}