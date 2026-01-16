import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': {
        target: 'https://localhost:44391',
        changeOrigin: true, // This changes the 'Host' header to 'localhost:44391'
        secure: false,      // Allows the self-signed certificate
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // This mirrors exactly what your successful CURL did
            proxyReq.setHeader('Origin', 'https://localhost:44391');
          });
        },
      }
    }
  }
})