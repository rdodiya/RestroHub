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
        
        // Map theme object to CSS variables
        const themeMapping = {
            primary: '--color-primary',
            primaryHover: '--color-primary-hover',
            primaryDark: '--color-primary-dark',
            bgPrimary: '--color-bg-primary',
            bgSecondary: '--color-bg-secondary',
            bgTertiary: '--color-bg-tertiary',
            textPrimary: '--color-text-primary',
            textSecondary: '--color-text-secondary',
            textMuted: '--color-text-muted'
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
    }, []);

    // Load site data from API
    const loadSiteData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const data = await ApiService.fetchSiteData();
            setSiteData(data);
            
            // Apply theme from API data
            if (data?.theme) {
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
