import { pluginReact } from '@rsbuild/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path-browserify';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import loadEnv from './loadEnv';
import { viteStaticCopy } from 'vite-plugin-static-copy';

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
      pluginReact(),
      TanStackRouterVite({ autoCodeSplitting: true }),
      react(),
      viteStaticCopy({
        targets: [
          {
            src: 'public/sw.js', // Source file
            dest: '', // Copy to dist root
          },
        ],
      }),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        includeAssets: ['robots.txt', 'sw.js'],
        manifest: {
          name: 'Buddhaword',
          short_name: 'Buddhaword',
          description: 'The Word of Buddha',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/',
          icons: [
            { src: '/icons/Icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/Icon-512.png', sizes: '512x512', type: 'image/png' },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
          globPatterns: ['**/*.{js,css,html,svg,png,ico,json,woff2}'],
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//, /\/admin/], // ❌ Avoid caching API endpoints
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/your-api-url\.com\/.*/i, // Cache API requests
              handler: 'NetworkFirst', // Try network first, fallback to cache
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for 7 days
                },
                networkTimeoutSeconds: 5, // Failover time
              },
            },
            {
              urlPattern: /\.(?:js|css|html|json)$/, // Cache static assets
              handler: 'StaleWhileRevalidate', // Serve from cache first, update in background
              options: {
                cacheName: 'static-resources',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                },
              },
            },
            {
              // 🔹 Cache UI assets (CSS, JS, images, fonts)
              urlPattern:
                /\.(?:js|css|woff2?|png|jpg|jpeg|gif|svg|ico|webp|avif)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'static-assets',
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              // 🔹 Ensure `index.html` works in offline mode
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'html-cache',
                expiration: {
                  maxEntries: 1,
                  maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
                },
              },
            },
            {
              // 🔹 Cache API responses for offline mode
              urlPattern: /^https:\/\/example-api\.com\/.*/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
                },
                cacheableResponse: { statuses: [0, 200] },
                backgroundSync: {
                  name: 'api-queue',
                  options: {
                    maxRetentionTime: 24 * 60, // 24 hours
                  },
                },
              },
            },
            {
              // 🔹 Fallback for offline images
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico|webp)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'image-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                },
              },
            },
            {
              // 🔹 Cache API responses and serve from cache when offline
              urlPattern: /^https:\/\/example-api\.com\/.*/,
              handler: 'StaleWhileRevalidate', // 🚀 Use cache first, update in the background
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
                },
                cacheableResponse: { statuses: [0, 200] },
                backgroundSync: {
                  name: 'api-queue',
                  options: {
                    maxRetentionTime: 24 * 60, // 24 hours
                  },
                },
              },
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
