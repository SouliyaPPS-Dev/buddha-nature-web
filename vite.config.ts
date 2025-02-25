import { pluginReact } from '@rsbuild/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path-browserify';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import loadEnv from './loadEnv';

export default defineConfig(({ mode }) => {
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
      pluginReact(), // Keep only one React plugin (remove @vitejs/plugin-react if not needed)
      TanStackRouterVite({ autoCodeSplitting: true }),
      react(),
      VitePWA({
        registerType: 'autoUpdate', // Automatically updates the service worker
        devOptions: { enabled: true }, // Enables service worker in development
        workbox: {
          // Cache navigation requests (e.g., HTML pages)
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkFirst', // Try network first, fall back to cache
              options: {
                cacheName: 'pages',
                expiration: {
                  maxEntries: 50, // Limit cache size
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                },
              },
            },
            // Cache static assets (JS, CSS, images)
            {
              urlPattern: /\.(?:js|css|png|jpg|jpeg|svg|woff2)$/,
              handler: 'CacheFirst', // Serve from cache first
              options: {
                cacheName: 'static-assets',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
                },
              },
            },
            // Cache API calls (optional, adjust based on your needs)
            {
              urlPattern: /^https:\/\/your-api-endpoint\.com\/.*/,
              handler: 'NetworkFirst', // Try network, fall back to cache
              options: {
                cacheName: 'api',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 24 * 60 * 60, // 1 day
                },
              },
            },
          ],
          navigateFallback: '/index.html', // Serve index.html for navigation requests
          cleanupOutdatedCaches: true, // Remove old caches
        },
        manifest: {
          name: 'Buddhaword',
          short_name: 'Buddhaword',
          description: 'The Word of Buddha',
          theme_color: '#FFAF5D',
          icons: [
            {
              src: '/images/logo.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/images/logo.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
    ],
    build: {
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.split('node_modules/')[1].split('/')[0];
            }
          },
        },
      },
    },
  };
});
