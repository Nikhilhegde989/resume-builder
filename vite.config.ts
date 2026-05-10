import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',   // relative paths so it works on any GitHub Pages subdirectory URL
  plugins: [react()],
  optimizeDeps: {
    include: ['@react-pdf/renderer'],
  },
  build: {
    commonjsOptions: {
      include: [/@react-pdf\/renderer/, /node_modules/],
    },
  },
})
