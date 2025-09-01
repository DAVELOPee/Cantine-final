/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-background': '#F8F6F4',   // Avorio neutro elegante
        'brand-primary': '#5B1A1A',      // Rosso vino barricato
        'brand-secondary': '#2F3E2C',    // Verde vite scuro
        'brand-accent': '#8C7851',       // Oro/bronzo smorzato
        'brand-highlight': '#A27E4E',    // Oro caldo per accenti
        'brand-text': '#2B211C',         // Marrone profondo / quasi nero
        'brand-light-text': '#7D6654',   // Testo secondario
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'], 
        'serif': ['Playfair Display', 'serif'], 
      },
    },
  },
  plugins: [],
}
