import { pluginReact } from '@rsbuild/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path-browserify';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import loadEnv from './loadEnv';
import compress from 'vite-plugin-compression';

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
      compress({
        algorithm: 'brotliCompress',
        ext: '.br',
      }),
      pluginReact(),
      TanStackRouterVite({
        autoCodeSplitting: true,
      }),
      react(),
      VitePWA({
        includeAssets: [
          'images/*.png',
          'images/*.jpg',
          'icons/*.png',
          'robots.txt',
          '**/*.{woff,woff2,svg,json}',
        ],
        registerType: 'autoUpdate',
        strategies: 'injectManifest',
        srcDir: 'src', // Source directory for sw.js
        filename: 'sw.js', // Source service worker file
        injectManifest: {
          globPatterns: ['**/*.{js,css,html,png,jpg,svg,ico}'], // Files to precache
          maximumFileSizeToCacheInBytes: 100 * 1024 * 1024, // Set to 100 MiB (adjust as needed)
        },
        manifest: {
          name: 'Buddhaword',
          short_name: 'Buddhaword',
          description: 'The Word of Buddha',
          theme_color: '#FFAF5D', // Match your theme
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

        workbox: {
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB for larger apps
          globPatterns: [
            '**/*.{js,css,html,svg,png,jpg,jpeg,gif,woff,woff2,ico,json}',
          ],
          globIgnores: ['**/node_modules/**/*'],
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
          navigateFallback: '/index.html',
          runtimeCaching: [
            {
              urlPattern:
                /\.(?:js|css|woff2?|png|jpg|jpeg|gif|svg|ico|webp|avif|json)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'static-assets',
                expiration: {
                  maxEntries: 300,
                  maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'html-cache',
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
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            router: ['@tanstack/react-router'],
          },
        },
      },
    },
  };
});
