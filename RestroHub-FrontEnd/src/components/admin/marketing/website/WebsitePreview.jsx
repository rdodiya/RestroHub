/**
 * WebsitePreview.jsx
 * Path: src/components/admin/marketing/website/WebsitePreview.jsx
 */

import { Eye, ExternalLink, Monitor, Smartphone, Tablet, RefreshCw } from 'lucide-react';
import { useState, useCallback, useRef } from 'react';
import { useSiteData } from '../../../../context/SiteContext';
import { useAdminTheme } from '@context/AdminThemeContext';

const SITE_ORIGIN = window.location.origin;

const getPreviewUrl = (slug) => {
  const branch = localStorage.getItem('current_branch_id') || localStorage.getItem('selectedBranchId') || '1';
  const activeSlug = slug || 'rajkot-dhaba';
  return `${SITE_ORIGIN}/Restrohub/${activeSlug}/${branch}?preview=1`;
};

const WebsitePreview = () => {
  const [device, setDevice] = useState('desktop');
  const [reloadKey, setReloadKey] = useState(0);
  const { slug, siteData } = useSiteData();
  const { isDark } = useAdminTheme();
  const iframeRef = useRef(null);

  const templateName = siteData?.templateKey || 'Modern';
  const themeName = siteData?.theme?.name || siteData?.theme?.themeKey || 'Custom';
  const isSiteDark = siteData?.theme?.isDarkMode ?? false;

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
    desktop: 'h-[540px]',
    tablet: 'h-[620px]',
    mobile: 'h-[720px]',
  };

  const previewUrl = getPreviewUrl(slug);

  const handleReload = useCallback(() => setReloadKey((k) => k + 1), []);

  return (
    <div className={`overflow-hidden rounded-2xl border shadow-sm ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className={`flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 ${isDark ? 'border-gray-700 bg-gray-800/80' : 'border-gray-100 bg-gray-50/50'}`}>
        <div className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isDark ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            <Eye className="h-4 w-4" />
          </div>
          <div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Live Customer Website Preview
            </h3>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Test how your live menu renders across desktop, tablet, and mobile devices
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Device Toggle */}
          <div className={`inline-flex rounded-xl border p-1 ${isDark ? 'border-gray-700 bg-gray-900/60' : 'border-gray-200 bg-gray-100/70'}`}>
            {devices.map((d) => {
              const Icon = d.icon;
              const isActive = device === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setDevice(d.id)}
                  className={`
                    inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5
                    text-xs font-semibold transition-all
                    ${isActive
                      ? isDark
                        ? 'bg-gray-800 text-blue-400 shadow-sm'
                        : 'bg-white text-blue-600 shadow-sm'
                      : isDark
                        ? 'text-gray-400 hover:text-gray-200'
                        : 'text-gray-600 hover:text-gray-900'
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
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
              isDark
                ? 'border-gray-700 bg-gray-700/60 text-gray-300 hover:bg-gray-700'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
            }`}
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
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
              isDark
                ? 'border-blue-700/50 bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-sm'
            }`}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Open Live Site</span>
          </a>
        </div>
      </div>

      {/* ── Info badges ─────────────────────────────────────────────────── */}
      <div className={`flex flex-wrap items-center justify-center gap-2.5 border-b px-4 py-2.5 ${isDark ? 'border-gray-700/80 bg-gray-900/40' : 'border-gray-100 bg-gray-50/70'}`}>
        <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${isDark ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
          Template: {templateName}
        </span>
        <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${isDark ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40' : 'bg-purple-50 text-purple-700 border border-purple-200'}`}>
          Theme: {themeName}
        </span>
        <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
          isSiteDark
            ? 'bg-gray-800 text-gray-200 border border-gray-700'
            : 'bg-amber-50 text-amber-800 border border-amber-200'
        }`}>
          {isSiteDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </span>
        <span className={`rounded-lg px-2.5 py-1 text-xs font-medium uppercase tracking-wider ${isDark ? 'bg-gray-800 text-gray-400 border border-gray-700' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
          Viewport: {device}
        </span>
      </div>

      {/* ── Preview iframe container ─────────────────────────────────────── */}
      <div className={`px-4 py-6 sm:px-6 sm:py-8 ${isDark ? 'bg-gray-900/80' : 'bg-gray-100/70'}`}>
        <div className={`${previewWidths[device]} transition-all duration-300`}>
          {/* Browser chrome bar */}
          <div className={`flex items-center gap-2 rounded-t-xl border border-b-0 px-4 py-2.5 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-200/90'}`}>
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
            <div className={`ml-2 flex-1 rounded-lg px-3 py-1 text-xs font-mono truncate border ${isDark ? 'border-gray-700 bg-gray-900 text-gray-400' : 'border-gray-200 bg-white text-gray-500 shadow-inner'}`}>
              {previewUrl}
            </div>
          </div>

          {/* Iframe */}
          <div className={`${previewHeights[device]} w-full overflow-hidden rounded-b-xl border shadow-lg ${isDark ? 'border-gray-700 bg-gray-950' : 'border-gray-200 bg-white'}`}>
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

        <p className={`mt-3 text-center text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Theme changes take effect immediately in the preview. Click <strong>Reload</strong> if iframe caching delays updates.
        </p>
      </div>
    </div>
  );
};

export default WebsitePreview;
