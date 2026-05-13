// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Use .admin-dark class on <html> (set by AdminThemeContext) to activate dark: variants.
  // This is intentionally scoped to "admin-dark" so it never interferes with the
  // customer-facing website template which uses CSS variables instead.
  darkMode: ['selector', '.admin-dark'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#d5f0ff',
          500: '#16b9f9',
          600: '#0ca4ea',
          700: '#0c88c2',
        }
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
}