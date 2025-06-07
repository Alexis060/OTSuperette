// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Esta configuración intercepta cualquier petición del frontend que comience con '/api'
      // y la redirige al servidor backend especificado en 'target'.
      '/api': {
        target: 'http://localhost:5000', // La URL de tu backend
        changeOrigin: true, // Necesario para que el backend acepte la petición
        secure: false,      // No es necesario para desarrollo en HTTP
      }
    }
  }
})