import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Vite port
    proxy: {
      '/api': {
        target: 'https://localhost:44391', // .NET port
        changeOrigin: true,
        secure: false, // Allows self-signed SSL certificates in development
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
        },
      }
    }
  }
})