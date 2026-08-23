// Website.jsx
// Path: src/components/admin/marketing/website/Website.jsx

import { useState, useCallback, useRef, useEffect } from 'react';
import { useSiteData } from '@context/SiteContext.jsx';
import ThemeSelector from './ThemeSelector';
import WebsitePreview from './WebsitePreview';
import WebsiteHeader from './WebsiteHeader';
import SectionEditor from './SectionEditor';
;

const Website = () => {
  const { siteData, updateSiteConfig } = useSiteData();
  const { slug, fetchSlug } = useSiteData();

  const handleSave = async () => {
    debugger
    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");

    await updateSiteConfig(token);
  };

  useEffect(() => {
    debugger
    fetchSlug();
  }, []);

  return (
    <>
      <WebsiteHeader
        onSave={handleSave}
      />
      <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
        <ThemeSelector />
        <SectionEditor />
      </div>
      <WebsitePreview />

    </>
  );
};

export default Website;
// // Website.jsx
// // Path: src/components/admin/marketing/website/Website.jsx

// import { useState, useCallback } from 'react';
// import WebsiteHeader from './WebsiteHeader';
// import TemplateSelector from './TemplateSelector';
// import ThemeSelector from './ThemeSelector';
// import WebsitePreview from './WebsitePreview';
// import WebsiteModeToggle from './WebsiteModeToggle';

// const STORAGE_KEY = 'website-theme-config';

// const loadSaved = () => {
//   try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
// };

// const Website = () => {
//   debugger
//   const saved = loadSaved();

//   // const [selectedTemplate, setSelectedTemplate] = useState(saved.template || 'modern');
//   const [selectedTheme, setSelectedTheme]       = useState(saved.palette  || 'blue');
//   const [websiteMode, setWebsiteMode]           = useState(saved.mode     || 'dark');
//   const [customPrimary, setCustomPrimary]       = useState(saved.customPrimary   || '#3b82f6');
//   const [customSecondary, setCustomSecondary]   = useState(saved.customSecondary || '#2563eb');

//   // Write current state to localStorage on every change
//   const persist = useCallback((patch) => {
//     const current = loadSaved();
//     localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...patch }));
//   }, []);

//   ///const handleTemplateChange = (v) => { setSelectedTemplate(v); persist({ template: v }); };
//   const handleThemeChange    = (v) => { setSelectedTheme(v);    persist({ palette: v });  };
//   const handleModeChange     = (v) => { setWebsiteMode(v);      persist({ mode: v });     };
//   const handleCustomPrimaryChange   = (v) => { setCustomPrimary(v);   persist({ customPrimary: v });   };
//   const handleCustomSecondaryChange = (v) => { setCustomSecondary(v); persist({ customSecondary: v }); };

//   // Save = already in localStorage; optionally call backend API too
//   const handleSave = useCallback(async () => {
//     debugger
//     const config = {
//       // template: selectedTemplate,
//       palette:  selectedTheme,
//       mode:     websiteMode,
//       customPrimary,
//       customSecondary,
//     };
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(config));

//     // Optional: persist to backend (non-blocking)
//     try {
//       const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
//       if (token) {
//         const slug = localStorage.getItem('current_restaurant_slug');
//         if (slug) {
//           await fetch(`http://localhost:8181/restroly/secure/api/v1/sites/${slug}/config`, {
//             method: 'PATCH',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({ metaData: config }),
//           });
//         }
//       }
//     } catch (err) {
//       console.warn('Could not persist config to backend:', err);
//     }
//   }, [selectedTheme, websiteMode, customPrimary, customSecondary]);

//   return (
//     <div className="space-y-5 sm:space-y-6">
//       <WebsiteHeader onSave={handleSave} />

//       <WebsiteModeToggle mode={websiteMode} onModeChange={handleModeChange} />

//       <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
//         {/* <TemplateSelector
//           selectedTemplate={selectedTemplate}
//           onTemplateChange={handleTemplateChange}
//         /> */}
//         <ThemeSelector
//           selectedTheme={selectedTheme}
//           onThemeChange={handleThemeChange}
//           customPrimary={customPrimary}
//           onCustomPrimaryChange={handleCustomPrimaryChange}
//           customSecondary={customSecondary}
//           onCustomSecondaryChange={handleCustomSecondaryChange}
//         />
//       </div>

//       <WebsitePreview
//         selectedTemplate={'modern'}
//         selectedTheme={selectedTheme}
//         websiteMode={websiteMode}
//       />
//     </div>
//   );
// };

// export default Website;