/**
 * SiteContext.jsx
 * Path: src/context/SiteContext.jsx
 *
 * CHANGES FROM ORIGINAL:
 *  1. fetchSiteData() now calls the real backend endpoint:
 *     GET /public/api/v1/sites/{siteId}/config
 *     The siteId is derived from the URL: /Restrohub/:restaurantSlug/:branchId
 *     We use restaurantSlug as siteId (matches SiteConfig.siteId / pageSlug).
 *
 *  2. mapApiResponseToSiteData() translates the PublicSiteConfigResponse
 *     (sections array + theme + brand) → the flat siteData shape that all
 *     customer components already consume. Zero changes needed in child components.
 *
 *  3. Theme application now uses the backend ThemeResponse field names
 *     (primaryColor, bgPrimary, isDarkMode …) instead of the old camelCase keys.
 *
 *  4. updateSiteConfig() — helper for the admin Website panel to PATCH
 *     theme + section content back to the API and also refresh the live
 *     preview instantly via updateTheme(). Now accepts an optional
 *     sectionsPayload (flat siteData shape) which is converted into the
 *     sections[] array the backend expects, keyed by SectionType.
 *
 *  5. Saved localStorage config (admin override) still takes priority so that
 *     the live preview in the admin panel works even before the API is called.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { defaultSiteData } from '@data/defaultData.js';

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE = 'http://localhost:8181/restroly/public/api/v1';
const STORAGE_KEY = 'website-theme-config';

// ─── Context ──────────────────────────────────────────────────────────────────

const SiteContext = createContext(null);

export const useSiteData = () => {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSiteData must be used within a SiteProvider');
  return ctx;
};

export const useTheme = () => {
  const { siteData, updateTheme } = useSiteData();
  return { theme: siteData?.theme || defaultSiteData.theme, updateTheme };
};

// ─── Helper: map backend PublicSiteConfigResponse → flat siteData shape ───────
//
// The backend returns:
//   { siteId, siteName, templateKey, theme: ThemeResponse, menu: MenuResponse, sections: [...] }
//
// Each section has: { sectionKey, displayOrder, isVisible, content: {...}, styles }
// We extract each section's content block and merge it into the flat siteData shape.

function mapApiResponseToSiteData(apiData) {
  debugger
  const sectionMap = {};
  (apiData.sections || []).forEach(section => {
    if (section.isVisible !== false) {
      sectionMap[section.sectionKey.toUpperCase()] = section;
    }
  });

  const getSection = (key) =>
    sectionMap[key.toUpperCase()] || {};
  const getContent = (key) =>
    getSection(key).content || {};

  // ============================================
  // Theme
  // ============================================
  const apiTheme = apiData.theme || {};
  const theme = {
    // ========= Basic Info =========
    id: apiTheme.id ?? defaultSiteData.id,
    name: apiTheme.name || defaultSiteData.name,
    themeKey: apiTheme.themeKey || defaultSiteData.themeKey,
    description: apiTheme.description || defaultSiteData.description,

    // ========= Mode =========
    mode: apiTheme.isDarkMode ? "dark" : "light",

    // ========= Primary Colors =========
    primaryColor: apiTheme.primaryColor || defaultSiteData.primary,
    colorPrimaryHover: apiTheme.colorPrimaryHover || defaultSiteData.primaryHover,
    primaryDark: apiTheme.colorPrimaryDark || defaultSiteData.primaryDark,
    secondaryColor: apiTheme.secondaryColor || defaultSiteData.secondaryColor,
    colorAccent: apiTheme.colorAccent || defaultSiteData.colorAccent,

    // ========= Background Colors =========
    bgPrimary: apiTheme.bgPrimary || defaultSiteData.bgPrimary,
    bgSecondary: apiTheme.bgSecondary || defaultSiteData.bgSecondary,
    bgTertiary: apiTheme.bgTertiary || defaultSiteData.bgTertiary,
    bgCard: apiTheme.bgTertiary || defaultSiteData.bgCard,

    // ========= Text Colors =========
    primaryTextColor: apiTheme.primaryTextColor || defaultSiteData.textPrimary,
    secondaryTextColor: apiTheme.secondaryTextColor || defaultSiteData.textSecondary,
    textMuted: apiTheme.textMuted || defaultSiteData.textMuted,

    // ========= Component Colors =========
    headerBackground:
      apiTheme.headerBackground || defaultSiteData.headerBackground,
    footerBackground:
      apiTheme.footerBackground || defaultSiteData.footerBackground,
    buttonBackground:
      apiTheme.buttonBackground || defaultSiteData.buttonBackground,
    buttonText:
      apiTheme.buttonText || defaultSiteData.buttonText,

    // ========= Borders =========
    borderPrimary:
      apiTheme.borderColor || defaultSiteData.borderPrimary,
    borderSecondary:
      apiTheme.borderColor || defaultSiteData.borderSecondary,
    borderColor:
      apiTheme.borderColor || defaultSiteData.borderColor,

    // ========= Overlay =========
    overlayDark: defaultSiteData.overlayDark,
    overlayDarker: defaultSiteData.overlayDarker,
    overlayLight: defaultSiteData.overlayLight,

    // ========= Typography =========
    fontPrimary: apiTheme.fontPrimary || defaultSiteData.fontPrimary,
    fontHeading: apiTheme.fontHeading || defaultSiteData.fontHeading,
    fontSizeBase: apiTheme.fontSizeBase || defaultSiteData.fontSizeBase,

    // ========= Additional Styles =========
    customStylesJson:
      apiTheme.customStylesJson || defaultSiteData.customStylesJson,

    // ========= Status =========
    isActive: apiTheme.isActive ?? defaultSiteData.isActive,
    isDefault: apiTheme.isDefault ?? defaultSiteData.isDefault,
    isDarkMode: apiTheme.isDarkMode ?? defaultSiteData.isDarkMode,

    // ========= Audit =========
    createdAt: apiTheme.createdAt || defaultSiteData.createdAt,
    updatedAt: apiTheme.updatedAt || defaultSiteData.updatedAt,
  };

  // ============================================
  // Menu Entity
  // ============================================
  const menuEntity = apiData.menu || {};
  const menuCategories =
    (menuEntity.categories || []).map(category => category.name);
  const menuItems = {};
  (menuEntity.categories || []).forEach(category => {
    menuItems[category.name] = (category.foods || []).map(food => ({
      id: food.foodId,
      name: food.name,
      description: food.description,
      image: food.imageUrl,
      price: food.price,
      isVeg: food.isVeg,
      isAvailable: food.isAvailable
    }));
  });

  // ============================================
  // Return
  // ============================================

  return {

    siteId: apiData.siteId,

    siteName: apiData.siteName,

    templateKey: apiData.templateKey,

    theme,

    navigation:
      getContent("NAVIGATION") ??
      defaultSiteData.navigation,

    hero: {
      title:
        getContent("HERO").title ??
        defaultSiteData.hero.title,

      backgroundImage:
        getContent("HERO").backgroundImage ??
        defaultSiteData.hero.backgroundImage,

      ctaPrimary:
        getContent("HERO").ctaPrimary ??
        defaultSiteData.hero.ctaPrimary,

      ctaSecondary:
        getContent("HERO").ctaSecondary ??
        defaultSiteData.hero.ctaSecondary
    },

    about: {
      subtitle: sectionMap.ABOUT?.subtitle ?? defaultSiteData.about.subtitle,

      title: Array.isArray(sectionMap.ABOUT?.title)
        ? sectionMap.ABOUT.title
        : [sectionMap.ABOUT?.title].filter(Boolean),

      description: Array.isArray(sectionMap.ABOUT?.description)
        ? sectionMap.ABOUT.description
        : [sectionMap.ABOUT?.description].filter(Boolean),

      image: sectionMap.ABOUT?.image ?? defaultSiteData.about.image,

      stats: sectionMap.ABOUT?.stats ?? defaultSiteData.about.stats,

      hours: sectionMap.ABOUT?.hours ?? defaultSiteData.about.hours
    },

    menu: {
      title:
        menuEntity.menuName ??
        defaultSiteData.menu.title,

      subtitle:
        menuEntity.menuDesc ??
        defaultSiteData.menu.subtitle,

      categories: menuCategories,

      items: menuItems
    },

    gallery: {
      subtitle:
        getContent("GALLERY").subtitle ??
        defaultSiteData.gallery.subtitle,

      title:
        getContent("GALLERY").title ??
        defaultSiteData.gallery.title,

      images:
        getContent("GALLERY").images ??
        defaultSiteData.gallery.images
    },

    reservations: {
      subtitle:
        getContent("RESERVATION").subtitle ??
        defaultSiteData.reservations.subtitle,

      title:
        getContent("RESERVATION").title ??
        defaultSiteData.reservations.title,

      description:
        getContent("RESERVATION").description ??
        defaultSiteData.reservations.description,

      backgroundImage:
        getContent("RESERVATION").backgroundImage ??
        defaultSiteData.reservations.backgroundImage,

      timeSlots:
        getContent("RESERVATION").timeSlots ??
        defaultSiteData.reservations.timeSlots,

      guestOptions:
        getContent("RESERVATION").guestOptions ??
        defaultSiteData.reservations.guestOptions,

      formFields:
        getContent("RESERVATION").formFields ??
        defaultSiteData.reservations.formFields
    },

    contact: {
      location:
        getContent("CONTACT").location ??
        defaultSiteData.contact.location,

      hours:
        getContent("CONTACT").hours ??
        defaultSiteData.contact.hours,

      contact:
        getContent("CONTACT").contact ??
        defaultSiteData.contact.contact
    },

    footer:
      getContent("FOOTER") ??
      defaultSiteData.footer,

    social:
      getContent("FOOTER").socialLinks ??
      defaultSiteData.social,

    serviceFAB:
      getContent("SERVICE_FAB") ??
      {}
  };
}

// ─── Helper: build backend sections[] payload from flat editor siteData ───────
//
// Converts the flat shape produced above (and edited in SiteContentEditor)
// back into the sections[] array keyed by SectionType, matching what
// mapApiResponseToSiteData reads on the way in.

function buildSectionsPayload(flatSiteData) {
  return [
    { sectionKey: 'NAVIGATION', content: flatSiteData.navigation },
    { sectionKey: 'HERO', content: flatSiteData.hero },
    { sectionKey: 'ABOUT', content: flatSiteData.about },
    { sectionKey: 'GALLERY', content: flatSiteData.gallery },
    {
      sectionKey: 'RESERVATION',
      content: {
        subtitle: flatSiteData.reservations.subtitle,
        title: flatSiteData.reservations.title,
        description: flatSiteData.reservations.description,
        backgroundImage: flatSiteData.reservations.backgroundImage,
        timeSlots: flatSiteData.reservations.timeSlots,
        guestOptions: flatSiteData.reservations.guestOptions,
        formFields: flatSiteData.reservations.formFields,
      },
    },
    { sectionKey: 'CONTACT', content: flatSiteData.contact },
    {
      sectionKey: 'FOOTER',
      content: {
        text: flatSiteData.footer?.text,
        socialLinks: flatSiteData.footer?.socialLinks ?? flatSiteData.social,
      },
    },
    ...(flatSiteData.serviceFAB
      ? [{ sectionKey: 'SERVICE_FAB', content: flatSiteData.serviceFAB }]
      : []),
  ];
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export const SiteProvider = ({ children }) => {
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slug, setSlug] = useState("");

  // ── Apply theme CSS variables to :root ──────────────────────────────────────
  const applyTheme = useCallback((theme) => {
    debugger

    if (!theme) return;
    const root = document.documentElement;
    const varMap = {
      // ========= Primary Colors =========
      primaryColor: '--color-primary',
      colorPrimaryHover: '--color-primary-hover',
      primaryDark: '--color-primary-dark',
      secondaryColor: '--color-secondary',
      colorAccent: '--color-accent',

      // ========= Background Colors =========
      bgPrimary: '--color-bg-primary',
      bgSecondary: '--color-bg-secondary',
      bgTertiary: '--color-bg-tertiary',
      bgCard: '--color-bg-card',

      // ========= Text Colors =========
      primaryTextColor: '--color-text-primary',
      secondaryTextColor: '--color-text-secondary',
      textMuted: '--color-text-muted',

      // ========= Component Colors =========
      headerBackground: '--color-header-bg',
      footerBackground: '--color-footer-bg',
      buttonBackground: '--color-button-bg',
      buttonText: '--color-button-text',

      borderPrimary: '--color-border-primary',
      borderSecondary: '--color-border-secondary',
    };

    Object.entries(varMap).forEach(([key, cssVar]) => {
      if (theme[key]) root.style.setProperty(cssVar, theme[key]);
    });

    if (theme.primaryColor) {
      root.style.setProperty('--color-text-accent', theme.primaryColor);
      root.style.setProperty('--color-border-accent', theme.primaryColor);
    }

    root.setAttribute('data-site-theme', theme.isDarkMode ? 'dark' : 'light');
  }, []);

  // ── Get siteId from current URL path (/Restrohub/:slug/:branchId) ───────────
  const getSiteIdFromUrl = useCallback(() => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    // e.g. ['Restrohub', 'spice-route', '1'] → 'spice-route'
    return parts[1] || null;
  }, []);

  // ── Main data loader ─────────────────────────────────────────────────────────
  const loadSiteData = useCallback(async () => {
    debugger
    setLoading(true);
    setError(null);

    const savedConfig = (() => {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
    })();

    try {
      const currentSlug = await fetchSlug();
      let data;

      if (currentSlug) {
        const res = await fetch(`${API_BASE}/sites/${currentSlug}/config`);
        if (!res.ok) throw new Error(`API ${res.status}`);
        const apiResponse = await res.json();
        data = mapApiResponseToSiteData(apiResponse);
      } else {
        // Fallback when not on a restaurant page (e.g. admin panel uses preview)
        data = { ...defaultSiteData };
      }

      setSiteData(data);

      // Admin override takes priority over API theme
      if (savedConfig?.theme) {
        applyTheme(savedConfig.theme);
      } else {
        applyTheme(data.theme);
      }
    } catch (err) {
      console.error('SiteContext: failed to load site data', err);
      setError(err.message);

      const fallback = { ...defaultSiteData };
      setSiteData(fallback);

      if (savedConfig?.theme) {
        applyTheme(savedConfig.theme);
      } else {
        applyTheme(data.theme);
      }
    } finally {
      setLoading(false);
    }
  }, [applyTheme, getSiteIdFromUrl]);

  // ── Update theme (called by admin Website panel on palette change) ──────────
  const updateTheme = useCallback((newTheme) => {
    debugger
    setSiteData((prev) => {
      const updatedTheme = {
        ...prev.theme,
        ...newTheme,
      };
      applyTheme(updatedTheme);
      return {
        ...prev,
        theme: updatedTheme,
      };
    });
  }, [applyTheme]);

  // ── Update specific section data (admin live-edit future use) ───────────────
  const updateSection = useCallback((section, data) => {
    debugger
    setSiteData((prev) => ({
      ...prev,
      [section]: { ...prev?.[section], ...data },
    }));
  }, []);


  const updateSiteConfig = useCallback(async (token) => {
    debugger

    if (!siteData) return;
    const currentSlug = await fetchSlug();
    // 1. Save current theme to localStorage
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        theme: siteData.theme,
      })
    );

    // 2. Apply the current theme to the page
    applyTheme(siteData.theme);

    // 3. Persist to backend

    try {
      await fetch(`${API_BASE}/sites/${currentSlug}/config`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          theme: siteData.theme,
          sections: buildSectionsPayload(siteData),
        }),
      });
    } catch (err) {
      console.warn("SiteContext: could not persist config to backend", err);
    }
  }, [siteData, applyTheme, getSiteIdFromUrl]);

  const fetchSlug = async () => {
    debugger
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch('http://localhost:8181/restroly/secure/api/v1/users/fetchRestaurantId', {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const json = await response.json();
      setSlug(json.data);
      return json.data;
    } catch (err) {
      console.error("Could not fetch slug", err);
    }
  };

  useEffect(() => { loadSiteData(); }, [loadSiteData]);

  return (
    <SiteContext.Provider
      value={{
        siteData,
        loading,
        error,
        slug,
        fetchSlug,
        refreshData: loadSiteData,
        updateTheme,
        updateSection,
        updateSiteConfig,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export default SiteContext;