import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  base:'./',
  server: {
    port: 5173,
    host: true,
  //  cors: true,
    proxy: {
      '/api': {
        target: 'http://192.168.1.2:22080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
