/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Roboto', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
      },
      colors: {
        'brand-background': '#FFF8F0',
        'brand-primary': '#8C2D19',
        'brand-secondary': '#D97706',
        'brand-text': '#4B2A1E',
        'brand-light-text': '#A67B5B',
      }
    },
  },
  plugins: [],
}