import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import ApiService from '@services/public/ApiService';
import { defaultSiteData } from '@data/defaultData.js';

// ============================================
// SITE CONTEXT
// Provides global state for site data and theme
// ============================================

const SiteContext = createContext(null);

// Custom hook to use site context
export const useSiteData = () => {
    const context = useContext(SiteContext);
    if (!context) {
        throw new Error('useSiteData must be used within a SiteProvider');
    }
    return context;
};

// Theme management hook
export const useTheme = () => {
    const { siteData, updateTheme } = useSiteData();
    return {
        theme: siteData?.theme || defaultSiteData.theme,
        updateTheme
    };
};

// Site Provider Component
export const SiteProvider = ({ children }) => {
    const [siteData, setSiteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Apply theme to CSS variables
    const applyTheme = useCallback((theme) => {
        if (!theme) return;

        const root = document.documentElement;

        // Map theme object to CSS variables — covers all vars in variables.css
        const themeMapping = {
            primary:          '--color-primary',
            primaryHover:     '--color-primary-hover',
            primaryDark:      '--color-primary-dark',
            bgPrimary:        '--color-bg-primary',
            bgSecondary:      '--color-bg-secondary',
            bgTertiary:       '--color-bg-tertiary',
            bgCard:           '--color-bg-card',
            textPrimary:      '--color-text-primary',
            textSecondary:    '--color-text-secondary',
            textMuted:        '--color-text-muted',
            borderPrimary:    '--color-border-primary',
            borderSecondary:  '--color-border-secondary',
            overlayDark:      '--color-overlay-dark',
            overlayDarker:    '--color-overlay-darker',
            overlayLight:     '--color-overlay-light',
        };

        Object.entries(themeMapping).forEach(([key, cssVar]) => {
            if (theme[key]) {
                root.style.setProperty(cssVar, theme[key]);
            }
        });

        // Update accent colors that depend on primary
        if (theme.primary) {
            root.style.setProperty('--color-text-accent', theme.primary);
            root.style.setProperty('--color-border-accent', theme.primary);
        }

        // Set data-theme attribute so global.css can switch nav/scrollbar/loader styles
        const isDarkMode = theme.bgPrimary && (
            theme.bgPrimary === '#000000' ||
            theme.bgPrimary === '#0a0a0a' ||
            theme.bgPrimary.startsWith('#0') ||
            theme.bgPrimary.startsWith('#1')
        );
        root.setAttribute('data-site-theme', isDarkMode ? 'dark' : 'light');
    }, []);

    // Load site data from API
    const loadSiteData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const data = await ApiService.fetchSiteData();
            setSiteData(data);
            
            // Apply theme: saved admin config takes priority over API data
            const savedConfig = (() => {
                try { return JSON.parse(localStorage.getItem('website-theme-config')); } catch { return null; }
            })();
            if (savedConfig) {
                const PALETTES = {
                    blue:   { primary: '#3b82f6', primaryHover: '#60a5fa', primaryDark: '#2563eb' },
                    teal:   { primary: '#14b8a6', primaryHover: '#2dd4bf', primaryDark: '#0d9488' },
                    green:  { primary: '#22c55e', primaryHover: '#4ade80', primaryDark: '#16a34a' },
                    purple: { primary: '#8b5cf6', primaryHover: '#a78bfa', primaryDark: '#7c3aed' },
                    orange: { primary: '#f97316', primaryHover: '#fb923c', primaryDark: '#ea580c' },
                    red:    { primary: '#ef4444', primaryHover: '#f87171', primaryDark: '#dc2626' },
                };
                const DARK_BG  = {
                    bgPrimary: '#0a0a0a', bgSecondary: '#111111', bgTertiary: '#1a1a1a',
                    bgCard: '#1a1a1a', borderPrimary: '#374151', borderSecondary: '#1f2937',
                    textPrimary: '#ffffff', textSecondary: '#9ca3af', textMuted: '#6b7280',
                    overlayDark: 'rgba(0,0,0,0.5)', overlayDarker: 'rgba(0,0,0,0.6)', overlayLight: 'rgba(0,0,0,0.2)',
                };
                const LIGHT_BG = {
                    bgPrimary: '#ffffff', bgSecondary: '#f9fafb', bgTertiary: '#f3f4f6',
                    bgCard: '#ffffff', borderPrimary: '#d1d5db', borderSecondary: '#e5e7eb',
                    textPrimary: '#111827', textSecondary: '#374151', textMuted: '#6b7280',
                    overlayDark: 'rgba(0,0,0,0.3)', overlayDarker: 'rgba(0,0,0,0.4)', overlayLight: 'rgba(0,0,0,0.1)',
                };
                const colors = savedConfig.palette === 'custom'
                    ? { primary: savedConfig.customPrimary, primaryHover: savedConfig.customSecondary, primaryDark: savedConfig.customSecondary }
                    : (PALETTES[savedConfig.palette] || PALETTES.blue);
                const bg = savedConfig.mode === 'dark' ? DARK_BG : LIGHT_BG;
                applyTheme({ ...colors, ...bg });
            } else if (data?.theme) {
                applyTheme(data.theme);
            }
        } catch (err) {
            console.error('Failed to load site data:', err);
            setError(err.message);
            
            // Fallback to default data
            setSiteData(defaultSiteData);
            applyTheme(defaultSiteData.theme);
        } finally {
            setLoading(false);
        }
    }, [applyTheme]);

    // Update theme dynamically
    const updateTheme = useCallback((newTheme) => {
        setSiteData(prev => ({
            ...prev,
            theme: { ...prev?.theme, ...newTheme }
        }));
        applyTheme(newTheme);
    }, [applyTheme]);

    // Update specific section of site data
    const updateSection = useCallback((section, data) => {
        setSiteData(prev => ({
            ...prev,
            [section]: { ...prev?.[section], ...data }
        }));
    }, []);

    // Initial load
    useEffect(() => {
        loadSiteData();
    }, [loadSiteData]);

    // Context value
    const value = {
        siteData,
        loading,
        error,
        refreshData: loadSiteData,
        updateTheme,
        updateSection
    };

    return (
        <SiteContext.Provider value={value}>
            {children}
        </SiteContext.Provider>
    );
};

export default SiteContext;
