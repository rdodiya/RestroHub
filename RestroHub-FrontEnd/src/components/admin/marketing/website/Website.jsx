import { useState } from 'react';
import WebsiteHeader from './WebsiteHeader';
import TemplateSelector from './TemplateSelector';
import ThemeSelector from './ThemeSelector';
import WebsitePreview from './WebsitePreview';

const Website = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [selectedTheme, setSelectedTheme] = useState('blue');
  const [customPrimary, setCustomPrimary] = useState('#3b82f6');
  const [customSecondary, setCustomSecondary] = useState('#2563eb');

  const handleSave = () => {
    console.log('Saved:', {
      selectedTemplate,
      selectedTheme,
      customPrimary,
      customSecondary,
    });
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <WebsiteHeader onSave={handleSave} />

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
      />
    </div>
  );
};

export default Website;