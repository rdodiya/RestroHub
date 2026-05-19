// AdminThemeContext is now a thin re-export of the global ThemeContext
// so the admin panel shares the same dark-mode state as the rest of the app.
export { ThemeProvider as AdminThemeProvider, useTheme as useAdminTheme } from '@context/ThemeContext';
