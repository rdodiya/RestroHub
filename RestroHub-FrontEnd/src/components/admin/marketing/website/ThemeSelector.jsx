import { Palette, Type, Layers, ToggleLeft } from 'lucide-react';
import { useState } from 'react';
import { useSiteData } from '../../../../context/SiteContext';
import defaultSiteData from '../../../../data/defaultData';


// ============================================
// Field group config — mirrors the Theme entity 1:1
// ============================================

const COLOR_FIELDS = {
  primary: [
    { key: 'primaryColor', label: 'Primary', required: true },
    { key: 'colorPrimaryHover', label: 'Primary Hover' },
    { key: 'primaryDark', label: 'Primary Dark' },
    { key: 'secondaryColor', label: 'Secondary Color' },
    { key: 'colorAccent', label: 'Accent Color' },
  ],

  background: [
    { key: 'bgPrimary', label: 'Background Primary' },
    { key: 'bgSecondary', label: 'Background Secondary' },
    { key: 'bgTertiary', label: 'Background Tertiary' },
    { key: 'bgCard', label: 'Card Background' },
  ],

  text: [
    { key: 'primaryTextColor', label: 'Primary Text' },
    { key: 'secondaryTextColor', label: 'Secondary Text' },
    { key: 'textMuted', label: 'Muted Text' },
  ],

  component: [
    { key: 'headerBackground', label: 'Header Background' },
    { key: 'footerBackground', label: 'Footer Background' },
    { key: 'buttonBackground', label: 'Button Background' },
    { key: 'buttonText', label: 'Button Text' },
    { key: 'borderPrimary', label: 'Primary Border' },
    { key: 'borderSecondary', label: 'Secondary Border' },
  ],
};

const FONT_HEADING_OPTIONS = [
  'Inter, sans-serif',
  'Playfair Display, serif',
  'Poppins, sans-serif',
  'Merriweather, serif',
  'Montserrat, sans-serif',
  'Lora, serif',
];

const FONT_BODY_OPTIONS = [
  'Inter, sans-serif',
  'Roboto, sans-serif',
  'Open Sans, sans-serif',
  'Nunito Sans, sans-serif',
  'Source Sans Pro, sans-serif',
];

const inputClass =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all';
const labelClass = 'mb-1.5 block text-xs font-medium text-gray-600';

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-4 flex items-center gap-2.5">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
      <Icon className="h-4 w-4 text-blue-600" />
    </div>
    <div>
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  </div>
);

const ColorField = ({ label, value, onChange, required }) => (
  <div>
    <label className={labelClass}>
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border border-gray-200 bg-transparent"
      />
      <input
        type="text"
        value={value || ''}
        placeholder="#000000"
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} uppercase`}
      />
    </div>
  </div>
);

const TextField = ({ label, value, onChange, placeholder, required }) => (
  <div>
    <label className={labelClass}>
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
    <input
      type="text"
      value={value || ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className={labelClass}>{label}</label>
    <select value={value || ''} onChange={(e) => onChange(e.target.value)} className={inputClass}>
      <option value="" disabled>Choose a font…</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const ToggleField = ({ label, description, checked, onChange }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={() => onChange(!checked)}
    onKeyDown={(e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onChange(!checked);
      }
    }}
    className={`
      flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3.5 transition-all duration-200 select-none
      ${checked
        ? 'border-blue-200 bg-blue-50/50 shadow-xs'
        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60'
      }
    `}
  >
    <div className="min-w-0 flex-1">
      <p className={`text-xs font-semibold sm:text-sm transition-colors ${checked ? 'text-blue-900' : 'text-gray-800'}`}>
        {label}
      </p>
      {description && (
        <p className={`mt-0.5 text-[11px] sm:text-xs transition-colors ${checked ? 'text-blue-700/80' : 'text-gray-500'}`}>
          {description}
        </p>
      )}
    </div>
    <div
      className={`
        relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out sm:h-6 sm:w-11
        ${checked ? 'bg-blue-600' : 'bg-gray-200'}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out sm:h-5 sm:w-5
          ${checked ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0'}
        `}
      />
    </div>
  </div>
);

const ThemeSelector = () => {
  const { siteData, updateTheme } = useSiteData();

  const theme = siteData?.theme ?? {};

  const updateField = (field, value) => {
    updateTheme({
      ...theme,
      [field]: value
    });
  };

  return (
    <div className="flex max-h-[85vh] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* ============================= */}
      {/* HEADER + LIVE PREVIEW         */}
      {/* ============================= */}
      <div className="sticky top-0 z-10 shrink-0 border-b border-gray-100 bg-white/95 px-4 py-4 backdrop-blur-sm sm:px-6 sm:py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Palette className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 sm:text-base">Theme Editor</h3>
            <p className="text-xs text-gray-500 sm:text-sm">Edit every color, font, and setting for this theme</p>
          </div>
        </div>
      </div>

      {/* ============================= */}
      {/* BODY (SCROLLABLE)             */}
      {/* ============================= */}
      <div className="flex-1 overflow-y-auto space-y-8 px-4 py-5 sm:px-6 sm:py-6">

        {/* Identity */}
        {/* <div>
          <SectionHeader icon={Layers} title="Theme Identity" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              label="Name"
              required
              value={theme.name ?? ""}
              onChange={(value) => updateField("name", value)}
              placeholder="Ocean Blue Dark"
            />

            <TextField
              label="Theme Key"
              required
              value={theme.themeKey ?? ""}
              onChange={(value) => updateField("themeKey", value)}
              placeholder="OCEAN_BLUE_DARK"
            />
          </div>

          <div className="mt-4">
            <label className={labelClass}>Description</label>
            <textarea
              value={theme.description ?? ""}
              onChange={(e) => updateField("description", e.target.value)}
              rows={2}
              className={inputClass}
            />
          </div>
        </div> */}

        {/* Primary Colors */}
        <div className="border-t border-gray-100 pt-6">
          <SectionHeader
            icon={Palette}
            title="Primary Colors"
            subtitle="Brand & accent colors"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {COLOR_FIELDS.primary.map((field) => (
              <ColorField
                key={field.key}
                label={field.label}
                required={field.required}
                value={theme[field.key]}
                onChange={(value) => updateField(field.key, value)}
              />
            ))}
          </div>
        </div>

        {/* Background Colors */}
        <div className="border-t border-gray-100 pt-6">
          <SectionHeader icon={Palette} title="Background Colors" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {COLOR_FIELDS.background.map((field) => (
              <ColorField
                key={field.key}
                label={field.label}
                value={theme[field.key]}
                onChange={(value) => updateField(field.key, value)}
              />
            ))}
          </div>
        </div>

        {/* Text Colors */}
        <div className="border-t border-gray-100 pt-6">
          <SectionHeader icon={Palette} title="Text Colors" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {COLOR_FIELDS.text.map((field) => (
              <ColorField
                key={field.key}
                label={field.label}
                value={theme[field.key]}
                onChange={(value) => updateField(field.key, value)}
              />
            ))}
          </div>
        </div>

        {/* Component Colors */}
        <div className="border-t border-gray-100 pt-6">
          <SectionHeader
            icon={Palette}
            title="Component Colors"
            subtitle="Header, Footer, Buttons & Borders"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {COLOR_FIELDS.component.map((field) => (
              <ColorField
                key={field.key}
                label={field.label}
                value={theme[field.key]}
                onChange={(value) => updateField(field.key, value)}
              />
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="border-t border-gray-100 pt-6">
          <SectionHeader icon={Type} title="Typography" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="Body Font"
              value={theme.fontPrimary ?? ""}
              options={FONT_BODY_OPTIONS}
              onChange={(value) => updateField("fontPrimary", value)}
            />

            <SelectField
              label="Heading Font"
              value={theme.fontHeading ?? ""}
              options={FONT_HEADING_OPTIONS}
              onChange={(value) => updateField("fontHeading", value)}
            />
          </div>

          <div className="mt-4 max-w-xs">
            <TextField
              label="Base Font Size"
              value={theme.fontSizeBase ?? ""}
              onChange={(value) => updateField("fontSizeBase", value)}
              placeholder="16px"
            />
          </div>
        </div>

        {/* Status */}
        <div className="border-t border-gray-100 pt-6">
          <SectionHeader icon={ToggleLeft} title="Status" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ToggleField
              label="Active"
              description="Available for use"
              checked={theme.isActive ?? false}
              onChange={(checked) => updateField("isActive", checked)}
            />

            <ToggleField
              label="Default"
              description="Used when none selected"
              checked={theme.isDefault ?? false}
              onChange={(checked) => updateField("isDefault", checked)}
            />

            <ToggleField
              label="Dark Mode"
              description="Enable dark mode"
              checked={theme.isDarkMode ?? false}
              onChange={(checked) => updateField("isDarkMode", checked)}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ThemeSelector;

// import { Palette, Check } from 'lucide-react';

// const ThemeSelector = ({
//   selectedTheme,
//   onThemeChange,
//   customPrimary,
//   onCustomPrimaryChange,
//   customSecondary,
//   onCustomSecondaryChange,
// }) => {

//   return (
//     <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
//       {/* ============================= */}
//       {/* HEADER                        */}
//       {/* ============================= */}
//       <div className="border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
//         <div className="flex items-center gap-3">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
//             <Palette className="h-5 w-5 text-blue-600" />
//           </div>
//           <div>
//             <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
//               Color Theme
//             </h3>
//             <p className="text-xs text-gray-500 sm:text-sm">
//               Match your brand colors
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ============================= */}
//       {/* BODY                          */}
//       {/* ============================= */}
//       <div className="px-4 py-4 sm:px-6 sm:py-5">
//         {/* Theme Grid */}
//         <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
//           {themes.map((theme) => {
//             const isSelected = selectedTheme === theme.id;
//             return (
//               <button
//                 key={theme.id}
//                 onClick={() => onThemeChange(theme.id)}
//                 className={`
//                   flex items-center gap-3 rounded-xl border-2 p-3 text-left
//                   transition-all sm:p-4
//                   ${
//                     isSelected
//                       ? 'border-blue-200 bg-blue-50'
//                       : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
//                   }
//                 `}
//               >
//                 {/* Color Swatch */}
//                 <div
//                   className="h-8 w-8 shrink-0 rounded-lg shadow-sm"
//                   style={{
//                     background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
//                   }}
//                 />

//                 {/* Label */}
//                 <span
//                   className={`flex-1 text-sm font-medium ${
//                     isSelected ? 'text-blue-700' : 'text-gray-800'
//                   }`}
//                 >
//                   {theme.name}
//                 </span>

//                 {/* Check */}
//                 {isSelected && (
//                   <Check className="h-4 w-4 shrink-0 text-blue-600" />
//                 )}
//               </button>
//             );
//           })}
//         </div>

//         {/* Custom Colors */}
//         <div className="mt-5 border-t border-gray-100 pt-5 sm:mt-6 sm:pt-6">
//           <h4 className="mb-3 text-sm font-medium text-gray-900">
//             Custom Colors
//           </h4>
//           <div className="grid grid-cols-2 gap-3 sm:gap-4">
//             {/* Primary */}
//             <div>
//               <label className="mb-1.5 block text-xs font-medium text-gray-600 sm:text-sm">
//                 Primary
//               </label>
//               <div className="flex items-center gap-2">
//                 <input
//                   type="color"
//                   value={customPrimary}
//                   onChange={(e) => { onCustomPrimaryChange(e.target.value); onThemeChange('custom'); }}
//                   className="
//                     h-9 w-9 cursor-pointer rounded-lg border border-gray-200
//                     bg-transparent sm:h-10 sm:w-10
//                   "
//                 />
//                 <input
//                   type="text"
//                   value={customPrimary}
//                   onChange={(e) => { onCustomPrimaryChange(e.target.value); onThemeChange('custom'); }}
//                   className="
//                     w-full rounded-lg border border-gray-200 bg-white
//                     px-2.5 py-2 text-xs uppercase text-gray-900
//                     outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100
//                     transition-all sm:text-sm
//                   "
//                 />
//               </div>
//             </div>

//             {/* Secondary */}
//             <div>
//               <label className="mb-1.5 block text-xs font-medium text-gray-600 sm:text-sm">
//                 Secondary
//               </label>
//               <div className="flex items-center gap-2">
//                 <input
//                   type="color"
//                   value={customSecondary}
//                   onChange={(e) => { onCustomSecondaryChange(e.target.value); onThemeChange('custom'); }}
//                   className="
//                     h-9 w-9 cursor-pointer rounded-lg border border-gray-200
//                     bg-transparent sm:h-10 sm:w-10
//                   "
//                 />
//                 <input
//                   type="text"
//                   value={customSecondary}
//                   onChange={(e) => { onCustomSecondaryChange(e.target.value); onThemeChange('custom'); }}
//                   className="
//                     w-full rounded-lg border border-gray-200 bg-white
//                     px-2.5 py-2 text-xs uppercase text-gray-900
//                     outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100
//                     transition-all sm:text-sm
//                   "
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ThemeSelector;