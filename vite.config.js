import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the site from https://sara-k03.github.io/journey-to-the-east/
export default defineConfig({
  plugins: [react()],
  base: '/journey-to-the-east/',
})
