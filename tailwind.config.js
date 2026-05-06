/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Критически важная строка
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}