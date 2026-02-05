import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@locales': path.resolve(__dirname, 'src/locales'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@styles': path.resolve(__dirname, 'src/styles'),
    }
  },
  plugins: [react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // This ensures that your API calls (/api/...) are NOT handled 
        // by the service worker, allowing cookies to pass through normally.
        navigateFallbackDenylist: [/^\/api/], 
      },
      manifest: {
        name: 'Lyfie App',
        short_name: 'Lyfie',
        description: 'Offline-first journaling and dashboard',
        theme_color: '#ffffff',
        icons: [
          { src: 'icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })],
  server: {
    port: 5173, // Vite port
    proxy: {
      '/api': {
        target: 'https://localhost:44391', // .NET port
        changeOrigin: true,
        secure: false, // Allows self-signed SSL certificates in development
        configure: (proxy, _options) => {
          (proxy as any).on('error', (err: Error, _req: any, _res: any) => {
            console.log('proxy error', err);
          });
        },
      }
    }
  }
})