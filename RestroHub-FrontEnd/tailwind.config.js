// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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