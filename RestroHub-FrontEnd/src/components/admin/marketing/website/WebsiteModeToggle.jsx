import { Sun, Moon } from 'lucide-react';

/**
 * Dark / Light mode toggle for the restaurant's public website template.
 * This is separate from the admin panel theme.
 */
const WebsiteModeToggle = ({ mode, onModeChange }) => {
  const isDark = mode === 'dark';

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
            Website Display Mode
          </h3>
          <p className="text-xs text-gray-500 sm:text-sm">
            Choose how your restaurant website appears to customers
          </p>
        </div>

        {/* Toggle pill */}
        <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1">
          <button
            onClick={() => onModeChange('light')}
            className={`
              flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all
              ${!isDark ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}
            `}
            aria-pressed={!isDark}
          >
            <Sun className="h-4 w-4" />
            Light
          </button>
          <button
            onClick={() => onModeChange('dark')}
            className={`
              flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all
              ${isDark ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}
            `}
            aria-pressed={isDark}
          >
            <Moon className="h-4 w-4" />
            Dark
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebsiteModeToggle;
