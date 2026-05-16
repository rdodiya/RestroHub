import { Sun, Moon } from 'lucide-react';
import { useAdminTheme } from '@context/AdminThemeContext';

/**
 * Dark / Light mode toggle for the restaurant's public website template.
 * This is separate from the admin panel theme.
 */
const WebsiteModeToggle = ({ mode, onModeChange }) => {
  const { isDark } = useAdminTheme();
  const isWebsiteDark = mode === 'dark';

  return (
    <div className={`overflow-hidden rounded-2xl border px-4 py-4 sm:px-6 sm:py-5 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className={`text-sm font-semibold sm:text-base ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            Website Display Mode
          </h3>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Choose how your restaurant website appears to customers
          </p>
        </div>

        {/* Toggle pill */}
        <div className={`inline-flex rounded-xl border p-1 ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
          <button
            onClick={() => onModeChange('light')}
            className={`
              flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all
              ${!isWebsiteDark
                ? isDark ? 'bg-gray-600 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm'
                : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
              }
            `}
            aria-pressed={!isWebsiteDark}
          >
            <Sun className="h-4 w-4" />
            Light
          </button>
          <button
            onClick={() => onModeChange('dark')}
            className={`
              flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all
              ${isWebsiteDark
                ? 'bg-gray-800 text-white shadow-sm'
                : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
              }
            `}
            aria-pressed={isWebsiteDark}
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
