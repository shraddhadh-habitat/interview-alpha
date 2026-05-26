import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_APP_ENV': JSON.stringify(process.env.NODE_ENV || process.env.VITE_APP_ENV || 'production'),
  },
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  optimizeDeps: {
    exclude: ['pdfjs-dist'],
  },
})
