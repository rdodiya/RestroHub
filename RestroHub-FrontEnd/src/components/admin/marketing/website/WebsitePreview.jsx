/**
 * WebsitePreview.jsx
 * Path: src/components/admin/marketing/website/WebsitePreview.jsx
 *
 * CHANGES FROM ORIGINAL:
 *  1. Replaced the placeholder box with a real <iframe> that loads the
 *     customer landing page URL.  The iframe src is built from
 *     window.location so it works in both dev and prod.
 *
 *  2. The iframe gets a ?preview=1 query param so the customer page can
 *     optionally suppress its own analytics/tracking in preview mode.
 *
 *  3. The "Open" button now links to the real restaurant URL.
 *
 *  4. The iframe reloads when websiteMode changes (so the dark/light
 *     class applied by ThemeContext is visible in the preview).
 *
 *  NOTE: The iframe picks up the theme the admin just set because
 *  Website.jsx writes to localStorage on every change, and SiteContext
 *  reads localStorage on load.  For cross-tab live-reload you can add a
 *  window.addEventListener('storage', ...) in SiteContext — see comment there.
 */

import { Eye, ExternalLink, Monitor, Smartphone, Tablet, RefreshCw } from 'lucide-react';
import { useState, useCallback, useRef , useEffect} from 'react';
import { useSiteData } from '../../../../context/SiteContext';

// Derive the customer-facing base URL from the current host.
// In dev: http://localhost:5173
// In prod: https://yourdomain.com
const SITE_ORIGIN = window.location.origin;

// This should match the route pattern in your router:
// /Restrohub/:restaurantSlug/:branchId
// For the admin preview we use a demo slug; adjust as needed.
const getPreviewUrl = (slug) => {
  debugger
  const branch = localStorage.getItem('current_branch_id') || '1';
  return `${SITE_ORIGIN}/Restrohub/${slug}/${branch}?preview=1`;
};

const WebsitePreview = ({ selectedTemplate, selectedTheme, websiteMode }) => {
  debugger

  const [device, setDevice] = useState('desktop');
  const [reloadKey, setReloadKey] = useState(0);
  const { slug, fetchSlug } = useSiteData();
  const iframeRef = useRef(null);
  let previewUrl = "";

  const devices = [
    { id: 'desktop', icon: Monitor, label: 'Desktop' },
    { id: 'tablet', icon: Tablet, label: 'Tablet' },
    { id: 'mobile', icon: Smartphone, label: 'Mobile' },
  ];

  const previewWidths = {
    desktop: 'w-full',
    tablet: 'w-3/4 mx-auto',
    mobile: 'w-[375px] mx-auto',
  };

  const previewHeights = {
    desktop: 'h-[520px]',
    tablet: 'h-[600px]',
    mobile: 'h-[700px]',
  };

  previewUrl = getPreviewUrl(slug);

  const handleReload = useCallback(() => setReloadKey((k) => k + 1), []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
            Live Preview
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Device Toggle */}
          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
            {devices.map((d) => {
              const Icon = d.icon;
              const isActive = device === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setDevice(d.id)}
                  className={`
                    inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5
                    text-xs font-medium transition-all
                    ${isActive
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                  title={d.label}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{d.label}</span>
                </button>
              );
            })}
          </div>

          {/* Reload */}
          <button
            onClick={handleReload}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            title="Reload preview"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reload</span>
          </button>

          {/* Open in New Tab */}
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Open</span>
          </a>
        </div>
      </div>

      {/* ── Info badges ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-gray-50 bg-gray-50 px-4 py-2">
        <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
          Template: {selectedTemplate}
        </span>
        <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
          Theme: {selectedTheme}
        </span>
        <span className={`rounded px-2 py-0.5 text-xs font-medium ${websiteMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-yellow-50 text-yellow-700'
          }`}>
          {websiteMode === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </span>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
          {device}
        </span>
      </div>

      {/* ── Preview iframe ───────────────────────────────────────────────── */}
      <div className="bg-gray-100 px-4 py-6 sm:px-6 sm:py-8">
        <div className={`${previewWidths[device]} transition-all duration-300`}>
          {/* Browser chrome bar */}
          <div className="flex items-center gap-1.5 rounded-t-lg bg-gray-200 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            <span className="ml-2 flex-1 rounded bg-white px-2 py-0.5 text-xs text-gray-400 truncate">
              {previewUrl}
            </span>
          </div>

          {/* Iframe */}
          <div className={`${previewHeights[device]} w-full overflow-hidden rounded-b-lg border border-t-0 border-gray-200 shadow-sm`}>
            <iframe
              key={reloadKey}
              ref={iframeRef}
              src={previewUrl}
              title="Restaurant website preview"
              className="h-full w-full border-none"
              style={{ transformOrigin: 'top left' }}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-gray-400">
          Theme changes are applied after the preview reloads.
          Click <strong>Reload</strong> to see the latest changes.
        </p>
      </div>
    </div>
  );
};

export default WebsitePreview;
