import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Imposta il percorso base per la pubblicazione su GitHub Pages.
  // Questo assicura che i file vengano cercati nella sottocartella corretta.
  base: '/Cantine-final/',
  plugins: [react()],
})