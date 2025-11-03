import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/media':        { target: 'http://localhost:8000', changeOrigin: true },
      '/ingredients':  { target: 'http://localhost:8000', changeOrigin: true },
      '/profiles':     { target: 'http://localhost:8000', changeOrigin: true },
      '/promotions':   { target: 'http://localhost:8000', changeOrigin: true },
      '/publications': { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
})
