import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AdminThemeContext = createContext(null);

const STORAGE_KEY = 'admin-theme';

export const AdminThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply / remove the `dark` class on the <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('admin-dark');
    } else {
      root.classList.remove('admin-dark');
    }
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = useCallback(() => setIsDark((prev) => !prev), []);

  return (
    <AdminThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = () => {
  const ctx = useContext(AdminThemeContext);
  if (!ctx) throw new Error('useAdminTheme must be used within AdminThemeProvider');
  return ctx;
};
