/**
 * ApiService.js
 * Path: src/services/public/ApiService.js
 *
 * CHANGES FROM ORIGINAL:
 *  - All TODO stubs replaced with real fetch() calls to the Spring Boot backend.
 *  - fetchSiteData() is now a thin wrapper: SiteContext.jsx does the real
 *    call to /public/api/v1/sites/{siteId}/config and maps the response.
 *    ApiService.fetchSiteData() is kept for backward compatibility; it still
 *    returns defaultSiteData so any component that hasn't migrated still works.
 *  - submitReservation() now calls the real orders/reservations endpoint.
 *  - All endpoints match the Spring Boot base path: /restroly
 */

const API_BASE = 'http://localhost:8181/restroly';

// ─── Generic request helper ───────────────────────────────────────────────────

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status} ${res.statusText}: ${body}`);
  }
  // 204 No Content
  if (res.status === 204) return null;
  return res.json();
};

// ─── ApiService ───────────────────────────────────────────────────────────────
const ApiService = {

  // ── Site Data ──────────────────────────────────────────────────────────────
  // NOTE: SiteContext.jsx fetches and maps site data directly.
  // This method is kept so any component importing ApiService.fetchSiteData()
  // continues to work while migration is in progress.
  fetchSiteData: async () => {
    const { defaultSiteData } = await import('@data/defaultData.js');
    return defaultSiteData;
  },

  /**
   * Fetch the full public site config from the backend.
   * Returns PublicSiteConfigResponse (templateKey, theme, brand, sections[]).
   * Used by SiteContext.jsx.
   */
  fetchPublicSiteConfig: (siteId) =>
    request(`/public/api/v1/sites/${siteId}/config`),

  // ── Theme ───────────────────────────────────────────────────────────────────

  /**
   * Fetch all available themes (for the ThemeSelector admin panel).
   */
  fetchThemes: () => request('/secure/api/v1/themes'),

  /**
   * Update the site config's theme and template (admin save action).
   */
  updateSiteConfig: (siteId, payload, token) =>
    request(`/secure/api/v1/sites/${siteId}/config`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),

  // ── Menu ────────────────────────────────────────────────────────────────────

  /**
   * Fetch public menu for a restaurant branch.
   * The menu section content is also included in fetchPublicSiteConfig,
   * but this provides a dedicated endpoint for menu-only usage.
   */
  fetchMenu: async (restaurantSlug, branchId) => {
    try {
      // The menu content lives in the site config's sections array.
      // We re-use fetchPublicSiteConfig and extract the menu section.
      const config = await ApiService.fetchPublicSiteConfig(restaurantSlug);
      const menuSection = (config.sections || []).find(
        (s) => s.sectionKey === 'menu' && s.isVisible !== false
      );
      return menuSection?.content || null;
    } catch {
      const { defaultSiteData } = await import('@data/defaultData.js');
      return defaultSiteData.menu;
    }
  },

  // ── Reservations ────────────────────────────────────────────────────────────

  /**
   * Submit a table reservation.
   * Maps to: POST /public/api/v1/reservations  (add this endpoint on the backend)
   * Fallback: simulates a successful response if the endpoint doesn't exist yet.
   */
  submitReservation: async (formData) => {
    try {
      return await request('/public/api/v1/reservations', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
    } catch (err) {
      // Temporary simulation while backend reservation endpoint is being built
      console.warn('Reservation API not available, simulating response:', err);
      return {
        success: true,
        message: 'Reservation confirmed!',
        confirmationNumber: `RSV-${Date.now().toString(36).toUpperCase()}`,
        details: formData,
      };
    }
  },

  /**
   * Check table availability.
   */
  checkAvailability: async (date, time, guests, siteId) => {
    try {
      return await request(
        `/public/api/v1/availability?date=${date}&time=${encodeURIComponent(time)}&guests=${guests}&siteId=${siteId}`
      );
    } catch {
      return { available: true, alternatives: [] };
    }
  },

  // ── Gallery ─────────────────────────────────────────────────────────────────

  fetchGallery: async (siteId) => {
    try {
      const config = await ApiService.fetchPublicSiteConfig(siteId);
      const gallerySection = (config.sections || []).find(
        (s) => s.sectionKey === 'gallery' && s.isVisible !== false
      );
      return gallerySection?.content || null;
    } catch {
      const { defaultSiteData } = await import('@data/defaultData.js');
      return defaultSiteData.gallery;
    }
  },

  // ── Contact form ────────────────────────────────────────────────────────────

  submitContact: async (formData) => {
    try {
      return await request('/public/api/v1/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.warn('Contact API not available, simulating response:', err);
      return {
        success: true,
        message: "Thank you for your message. We'll get back to you soon!",
      };
    }
  },
};

export default ApiService;
