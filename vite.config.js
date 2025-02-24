import { pluginReact } from '@rsbuild/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path-browserify';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import loadEnv from './loadEnv';

export default defineConfig(({ mode }) => {
  // Load the appropriate .env file based on the mode
  const env = loadEnv(mode, process.cwd());

  return {
    base: '/',
    resolve: {
      alias: {
        path: 'path-browserify',
        '@': path.resolve(__dirname, 'src'),
      },
    },
    define: {
      'process.env': env,
    },
    plugins: [
      pluginReact(),
      TanStackRouterVite({
        autoCodeSplitting: true,
      }),
      react(),
      VitePWA({
        registerType: 'autoUpdate', // Automatically register service worker and auto-update
        manifest: {
          name: 'Buddhaword',
          short_name: 'Buddhaword',
          description: 'The Word of Buddha',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/',
          icons: [
            {
              src: '/icons/Icon-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/icons/Icon-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
        injectRegister: 'auto', // Automatically inject service worker registration script
        workbox: {
          maximumFileSizeToCacheInBytes: 3000000,
          globPatterns: ['**/*.{js,css,html,svg,png,ico}'], // Match asset files to cache
          cleanupOutdatedCaches: true, // Automatically delete outdated caches
          skipWaiting: true, // The newly installed SW takes control of the page immediately
          clientsClaim: true, // Take control of uncontrolled clients immediately
          navigateFallback: '/index.html', // Handle SPA routing fallback
          runtimeCaching: [
            {
              // Cache UI assets (CSS, JS, images, fonts, etc.)
              urlPattern:
                /\.(?:js|css|woff2?|png|jpg|jpeg|gif|svg|ico|webp|avif)$/i,
              handler: 'StaleWhileRevalidate', // Fetch from network if possible, otherwise fall back to cache
              options: {
                cacheName: 'static-assets',
                expiration: {
                  maxEntries: 200, // Up to 100 assets in cache
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days of max age for cached assets
                },
                cacheableResponse: {
                  statuses: [0, 200], // Cache valid HTTP responses
                },
              },
            },
            {
              urlPattern: /\/index\.html$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'html-cache',
                expiration: {
                  maxEntries: 1,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
            {
              urlPattern: /^https:\/\/example-api\.com\/.*/, // Replace with your API endpoint
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
          ],
        },
      }),
    ],
    build: {
      chunkSizeWarningLimit: 5000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Separate all node_modules into individual chunks
              return id.toString().split('node_modules/')[1].split('/')[0];
            }
          },
        },
      },
    },
  };
});
