import { useState } from 'react';
import WebsiteHeader from './WebsiteHeader';
import TemplateSelector from './TemplateSelector';
import ThemeSelector from './ThemeSelector';
import WebsitePreview from './WebsitePreview';
import WebsiteModeToggle from './WebsiteModeToggle';

const STORAGE_KEY = 'website-theme-config';

const loadSaved = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
};

const Website = () => {
  const saved = loadSaved();

  const [selectedTemplate, setSelectedTemplate] = useState(saved.template || 'modern');
  const [selectedTheme, setSelectedTheme]       = useState(saved.palette  || 'blue');
  const [websiteMode, setWebsiteMode]           = useState(saved.mode     || 'dark');
  const [customPrimary, setCustomPrimary]       = useState(saved.customPrimary   || '#3b82f6');
  const [customSecondary, setCustomSecondary]   = useState(saved.customSecondary || '#2563eb');

  // Persist config to localStorage — customer template reads this on load via SiteContext
  const handleSave = () => {
    const config = { template: selectedTemplate, palette: selectedTheme, mode: websiteMode, customPrimary, customSecondary };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <WebsiteHeader onSave={handleSave} />

      {/* Mode toggle — Dark / Light for the restaurant website */}
      <WebsiteModeToggle mode={websiteMode} onModeChange={setWebsiteMode} />

      <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
        />
        <ThemeSelector
          selectedTheme={selectedTheme}
          onThemeChange={setSelectedTheme}
          customPrimary={customPrimary}
          onCustomPrimaryChange={setCustomPrimary}
          customSecondary={customSecondary}
          onCustomSecondaryChange={setCustomSecondary}
        />
      </div>

      <WebsitePreview
        selectedTemplate={selectedTemplate}
        selectedTheme={selectedTheme}
        websiteMode={websiteMode}
      />
    </div>
  );
};

export default Website;
