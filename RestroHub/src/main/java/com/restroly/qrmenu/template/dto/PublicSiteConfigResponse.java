package com.restroly.qrmenu.template.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublicSiteConfigResponse {

    private String templateKey;
    private String componentName;
    private ThemeResponse theme;
    private BrandResponse brand;
    private List<NavigationItem> navigation;
    private List<SectionResponse> sections;
    private List<SocialLink> socialLinks;
    private Map<String, Object> footer;
    private Map<String, Object> metaData;
    private Map<String, Object> globalSettings;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ThemeResponse {

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

    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BrandResponse {
        private String name;
        private String fullName;
        private String tagline;
        private String established;
        private String logo;
        private String favicon;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NavigationItem {
        private String label;
        private String href;
        private String icon;
        private Boolean isExternal;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SectionResponse {
        private String id; // sectionKey as id for React
        private String sectionKey;
        private String sectionType;
        private String componentName;
        private Integer order;
        private String title;
        private String subtitle;
        private Map<String, Object> content;
        private Map<String, Object> settings;
        private Map<String, Object> style;
        private Boolean isVisible;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SocialLink {
        private String name;
        private String url;
        private String icon;
    }
}