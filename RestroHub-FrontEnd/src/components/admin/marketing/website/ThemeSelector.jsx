import { Palette, Check } from 'lucide-react';

const ThemeSelector = ({
  selectedTheme,
  onThemeChange,
  customPrimary,
  onCustomPrimaryChange,
  customSecondary,
  onCustomSecondaryChange,
}) => {
  const themes = [
    { id: 'blue', name: 'Ocean Blue', primary: '#3b82f6', secondary: '#2563eb' },
    { id: 'teal', name: 'Teal Fresh', primary: '#14b8a6', secondary: '#0d9488' },
    { id: 'green', name: 'Fresh Green', primary: '#22c55e', secondary: '#16a34a' },
    { id: 'purple', name: 'Royal Purple', primary: '#8b5cf6', secondary: '#7c3aed' },
    { id: 'orange', name: 'Sunset Orange', primary: '#f97316', secondary: '#ea580c' },
    { id: 'red', name: 'Classic Red', primary: '#ef4444', secondary: '#dc2626' },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* ============================= */}
      {/* HEADER                        */}
      {/* ============================= */}
      <div className="border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Palette className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
              Color Theme
            </h3>
            <p className="text-xs text-gray-500 sm:text-sm">
              Match your brand colors
            </p>
          </div>
        </div>
      </div>

      {/* ============================= */}
      {/* BODY                          */}
      {/* ============================= */}
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        {/* Theme Grid */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
          {themes.map((theme) => {
            const isSelected = selectedTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => onThemeChange(theme.id)}
                className={`
                  flex items-center gap-3 rounded-xl border-2 p-3 text-left
                  transition-all sm:p-4
                  ${
                    isSelected
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                {/* Color Swatch */}
                <div
                  className="h-8 w-8 shrink-0 rounded-lg shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                  }}
                />

                {/* Label */}
                <span
                  className={`flex-1 text-sm font-medium ${
                    isSelected ? 'text-blue-700' : 'text-gray-800'
                  }`}
                >
                  {theme.name}
                </span>

                {/* Check */}
                {isSelected && (
                  <Check className="h-4 w-4 shrink-0 text-blue-600" />
                )}
              </button>
            );
          })}
        </div>

        {/* Custom Colors */}
        <div className="mt-5 border-t border-gray-100 pt-5 sm:mt-6 sm:pt-6">
          <h4 className="mb-3 text-sm font-medium text-gray-900">
            Custom Colors
          </h4>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Primary */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600 sm:text-sm">
                Primary
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customPrimary}
                  onChange={(e) => { onCustomPrimaryChange(e.target.value); onThemeChange('custom'); }}
                  className="
                    h-9 w-9 cursor-pointer rounded-lg border border-gray-200
                    bg-transparent sm:h-10 sm:w-10
                  "
                />
                <input
                  type="text"
                  value={customPrimary}
                  onChange={(e) => { onCustomPrimaryChange(e.target.value); onThemeChange('custom'); }}
                  className="
                    w-full rounded-lg border border-gray-200 bg-white
                    px-2.5 py-2 text-xs uppercase text-gray-900
                    outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100
                    transition-all sm:text-sm
                  "
                />
              </div>
            </div>

            {/* Secondary */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600 sm:text-sm">
                Secondary
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customSecondary}
                  onChange={(e) => { onCustomSecondaryChange(e.target.value); onThemeChange('custom'); }}
                  className="
                    h-9 w-9 cursor-pointer rounded-lg border border-gray-200
                    bg-transparent sm:h-10 sm:w-10
                  "
                />
                <input
                  type="text"
                  value={customSecondary}
                  onChange={(e) => { onCustomSecondaryChange(e.target.value); onThemeChange('custom'); }}
                  className="
                    w-full rounded-lg border border-gray-200 bg-white
                    px-2.5 py-2 text-xs uppercase text-gray-900
                    outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100
                    transition-all sm:text-sm
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;