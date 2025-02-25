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
            src: 'src/sw.js', // Ensure the service worker is copied
            dest: '',
          },
        ],
      }),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
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
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // Increase Cache Limit (10MB)
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//, /\/admin/], // Don't cache API/Admin Pages

          runtimeCaching: [
            {
              // ✅ Cache All Pages for Offline Mode
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'CacheFirst',
              options: {
                cacheName: 'pages-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 30 * 24 * 60 * 60,
                },
              },
            },
            {
              // ✅ Cache UI assets (CSS, JS, Fonts, Images)
              urlPattern:
                /\.(?:js|css|woff2?|ttf|eot|png|jpg|jpeg|svg|gif|ico|webp|avif)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'static-assets',
                expiration: {
                  maxEntries: 500,
                  maxAgeSeconds: 60 * 24 * 60 * 60,
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              // ✅ Cache API responses (Offline-First)
              urlPattern: /^https:\/\/example-api\.com\/.*/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 7 * 24 * 60 * 60,
                },
                cacheableResponse: { statuses: [0, 200] },
                backgroundSync: {
                  name: 'api-sync',
                  options: { maxRetentionTime: 24 * 60 },
                },
              },
            },
            {
              // ✅ Cache Image Requests Efficiently
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico|webp|avif)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'image-cache',
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 30 * 24 * 60 * 60,
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
