package com.restroly.qrmenu.template.mapper;

import com.restroly.qrmenu.template.dto.ThemeDTO;
import com.restroly.qrmenu.template.entity.Theme;
import org.springframework.stereotype.Component;

@Component
public class ThemeMapper {

    public ThemeDTO mapToDTO(Theme theme) {

        if (theme == null) {
            return null;
        }

        return ThemeDTO.builder()
                .id(theme.getId())
                .name(theme.getName())
                .themeKey(theme.getThemeKey())
                .description(theme.getDescription())

                .primaryColor(theme.getPrimaryColor())
                .colorPrimaryHover(theme.getColorPrimaryHover())
                .colorPrimaryDark(theme.getColorPrimaryDark())

                .secondaryColor(theme.getSecondaryColor())
                .colorAccent(theme.getColorAccent())

                .bgPrimary(theme.getBgPrimary())
                .bgSecondary(theme.getBgSecondary())
                .bgTertiary(theme.getBgTertiary())

                .primaryTextColor(theme.getPrimaryTextColor())
                .secondaryTextColor(theme.getSecondaryTextColor())
                .textMuted(theme.getTextMuted())

                .headerBackground(theme.getHeaderBackground())
                .footerBackground(theme.getFooterBackground())

                .buttonBackground(theme.getButtonBackground())
                .buttonText(theme.getButtonText())

                .borderColor(theme.getBorderColor())

                .fontPrimary(theme.getFontPrimary())
                .fontHeading(theme.getFontHeading())
                .fontSizeBase(theme.getFontSizeBase())

                .customStylesJson(theme.getCustomStylesJson())

                .isActive(theme.getIsActive())
                .isDefault(theme.getIsDefault())
                .isDarkMode(theme.getIsDarkMode())

                .createdAt(theme.getCreatedAt())
                .updatedAt(theme.getUpdatedAt())
                .build();
    }

}