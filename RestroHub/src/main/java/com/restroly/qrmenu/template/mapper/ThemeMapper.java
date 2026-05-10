package com.restroly.qrmenu.template.mapper;

import com.restroly.qrmenu.template.dto.PublicSiteConfigResponse;
import com.restroly.qrmenu.template.dto.ThemeCreateRequest;
import com.restroly.qrmenu.template.dto.ThemeDTO;
import com.restroly.qrmenu.template.dto.ThemeUpdateRequest;
import com.restroly.qrmenu.template.entity.Theme;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ThemeMapper {

    public ThemeDTO toDTO(Theme theme) {
        if (theme == null) {
            return null;
        }

        return ThemeDTO.builder()
                .id(theme.getId())
                .name(theme.getName())
                .themeKey(theme.getThemeKey())
                .description(theme.getDescription())

                // Primary colors
                .primaryColor(theme.getPrimaryColor())
                .colorPrimaryHover(theme.getColorPrimaryHover())
                .colorPrimaryDark(theme.getColorPrimaryDark())
                .secondaryColor(theme.getSecondaryColor())
                .colorAccent(theme.getColorAccent())

                // Background colors
                .bgPrimary(theme.getBgPrimary())
                .bgSecondary(theme.getBgSecondary())
                .bgTertiary(theme.getBgTertiary())

                // Text colors
                .primaryTextColor(theme.getPrimaryTextColor())
                .secondaryTextColor(theme.getSecondaryTextColor())
                .textMuted(theme.getTextMuted())

                // Component colors
                .headerBackground(theme.getHeaderBackground())
                .footerBackground(theme.getFooterBackground())
                .buttonBackground(theme.getButtonBackground())
                .buttonText(theme.getButtonText())
                .borderColor(theme.getBorderColor())

                // Typography
                .fontPrimary(theme.getFontPrimary())
                .fontHeading(theme.getFontHeading())
                .fontSizeBase(theme.getFontSizeBase())

                // Additional styles
                .customStylesJson(theme.getCustomStylesJson())

                // Status
                .isActive(theme.getIsActive())
                .isDefault(theme.getIsDefault())
                .isDarkMode(theme.getIsDarkMode())

                // Audit
                .createdAt(theme.getCreatedAt())
                .updatedAt(theme.getUpdatedAt())
                .build();
    }

    public List<ThemeDTO> toDTOList(List<Theme> themes) {
        return themes.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Theme toEntity(ThemeCreateRequest request) {
        if (request == null) {
            return null;
        }

        return Theme.builder()
                .name(request.getName())
//                .themeKey(request.getThemeKey())
//                .description(request.getDescription())
//
//                // Primary colors
//                .primaryColor(request.getPrimaryColor())
//                .colorPrimaryHover(request.getColorPrimaryHover())
//                .colorPrimaryDark(request.getColorPrimaryDark())
//                .secondaryColor(request.getSecondaryColor())
//                .colorAccent(request.getColorAccent())
//
//                // Background colors
//                .bgPrimary(request.getBgPrimary())
//                .bgSecondary(request.getBgSecondary())
//                .bgTertiary(request.getBgTertiary())
//
//                // Text colors
//                .primaryTextColor(request.getPrimaryTextColor())
//                .secondaryTextColor(request.getSecondaryTextColor())
//                .textMuted(request.getTextMuted())
//
//                // Component colors
//                .headerBackground(request.getHeaderBackground())
//                .footerBackground(request.getFooterBackground())
//                .buttonBackground(request.getButtonBackground())
//                .buttonText(request.getButtonText())
//                .borderColor(request.getBorderColor())
//
//                // Typography
//                .fontPrimary(request.getFontPrimary())
//                .fontHeading(request.getFontHeading())
//                .fontSizeBase(request.getFontSizeBase())
//
//                // Extra styles
//                .customStylesJson(request.getCustomStylesJson())

                // Status (safe defaults)
                .isDarkMode(Boolean.TRUE.equals(request.getIsDarkMode()))
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .isDefault(request.getIsDefault() != null ? request.getIsDefault() : false)

                .build();
    }

    public void updateEntity(Theme theme, ThemeUpdateRequest request) {
        if (request.getName() != null) {
            theme.setName(request.getName());
        }
        if (request.getDescription() != null) {
            theme.setDescription(request.getDescription());
        }
        if (request.getPrimaryColor() != null) {
            theme.setPrimaryColor(request.getPrimaryColor());
        }
        if (request.getSecondaryColor() != null) {
            theme.setSecondaryColor(request.getSecondaryColor());
        }
//        if (request.getBackgroundColor() != null) {
//            theme.setBackgroundColor(request.getBackgroundColor());
//        }
//        if (request.getTextColor() != null) {
//            theme.setTextColor(request.getTextColor());
//        }
//        if (request.getAccentColor() != null) {
//            theme.setAccentColor(request.getAccentColor());
//        }
//        if (request.getHeaderBgColor() != null) {
//            theme.setHeaderBgColor(request.getHeaderBgColor());
//        }
//        if (request.getFooterBgColor() != null) {
//            theme.setFooterBgColor(request.getFooterBgColor());
//        }
//        if (request.getFontFamily() != null) {
//            theme.setFontFamily(request.getFontFamily());
//        }
//        if (request.getHeadingFontFamily() != null) {
//            theme.setHeadingFontFamily(request.getHeadingFontFamily());
//        }
//        if (request.getBorderRadius() != null) {
//            theme.setBorderRadius(request.getBorderRadius());
//        }
//        if (request.getButtonStyle() != null) {
//            theme.setButtonStyle(request.getButtonStyle());
//        }
        if (request.getIsDarkMode() != null) {
            theme.setIsDarkMode(request.getIsDarkMode());
        }
        if (request.getIsActive() != null) {
            theme.setIsActive(request.getIsActive());
        }
        if (request.getIsDefault() != null) {
            theme.setIsDefault(request.getIsDefault());
        }
    }

    public PublicSiteConfigResponse.ThemeResponse toPublicThemeResponse(Theme theme) {
        if (theme == null) {
            return null;
        }

        return PublicSiteConfigResponse.ThemeResponse.builder()
                .primaryColor(theme.getPrimaryColor())
                .secondaryColor(theme.getSecondaryColor())
                .colorAccent(theme.getColorAccent())

                .bgPrimary(theme.getBgPrimary())
                .bgSecondary(theme.getBgSecondary())

                .primaryTextColor(theme.getPrimaryTextColor())
                .secondaryTextColor(theme.getSecondaryTextColor())

                .headerBackground(theme.getHeaderBackground())
                .footerBackground(theme.getFooterBackground())

                .buttonBackground(theme.getButtonBackground())
                .buttonText(theme.getButtonText())

                .fontPrimary(theme.getFontPrimary())
                .fontHeading(theme.getFontHeading())
                .fontSizeBase(theme.getFontSizeBase())

                .isDarkMode(theme.getIsDarkMode())
                .build();

    }
}