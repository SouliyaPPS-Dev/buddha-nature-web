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
        algorithm: 'brotliCompress', // Use Brotli compression
        ext: '.br', // Output compressed files with .br extension
      }),
      pluginReact(),
      TanStackRouterVite({
        autoCodeSplitting: true,
      }),
      react(),
      VitePWA({
        includeAssets: [
          'logo.png',
          'logo_shared.png',
          'robots.txt', // Include robots.txt
        ],
        registerType: 'autoUpdate',
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
        injectRegister: 'auto',
        workbox: {
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // Set 4 MiB (or any desired value)
          globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
          navigateFallback: '/index.html',
          runtimeCaching: [
            {
              urlPattern:
                /\.(?:js|css|woff2?|png|jpg|jpeg|gif|svg|ico|webp|avif)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-assets',
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'html-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
            {
              urlPattern: /^https:\/\/example-api\.com\/.*/,
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
      chunkSizeWarningLimit: 4000, // Increase chunk warning size to 1 MB
      rollupOptions: {
        output: {
          manualChunks: {
            // Split specific libraries into separate chunks
            react: ['react', 'react-dom'],
            lodash: ['lodash'], // Example for splitting lodash
          },
        },
      },
    },
  };
});
