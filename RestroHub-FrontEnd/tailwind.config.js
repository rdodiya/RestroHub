// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // .admin-dark  → toggled by AdminThemeContext (admin panel only)
  // .dark        → toggled by PublicLayout based on system preference (login / public pages)
  // Both activate Tailwind's dark: variants; CSS-variable-based customer template is unaffected.
  darkMode: ['selector', ['.dark', '.admin-dark']],
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