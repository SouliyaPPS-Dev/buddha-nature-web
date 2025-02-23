import { pluginReact } from '@rsbuild/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path-browserify';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import compress from 'vite-plugin-compression';
import loadEnv from './loadEnv';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    base: '/', // Ensures consistent paths for caching
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
        registerType: 'autoUpdate', // Auto-update service worker on new version
        strategies: 'injectManifest', // Use custom sw.js
        srcDir: 'src',
        filename: 'sw.js',
        injectManifest: {
          globPatterns: [
            '**/*.{js,css,html,png,jpg,jpeg,svg,ico,woff,woff2,json}',
          ],
          maximumFileSizeToCacheInBytes: 100 * 1024 * 1024, // 100 MiB
        },
        includeAssets: [
          'index.html', // Explicitly include root HTML
          'images/**/*.{png,jpg}',
          'icons/*.png',
          'robots.txt',
          '**/*.{woff,woff2,svg,json}',
          'assets/**/*',
        ],
        manifest: {
          name: 'Buddhaword',
          short_name: 'Buddhaword',
          description: 'The Word of Buddha',
          theme_color: '#FFAF5D',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/',
          icons: [
            { src: '/icons/Icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/Icon-512.png', sizes: '512x512', type: 'image/png' },
          ],
        },
        workbox: {
          navigateFallback: '/index.html', // Serve index.html for all navigation requests
          cleanupOutdatedCaches: true, // Remove old caches
          skipWaiting: true, // Activate new SW immediately
          clientsClaim: true, // Take control of clients ASAP
          runtimeCaching: [
            {
              // Cache static assets (JS, CSS, images, fonts)
              urlPattern: /\.(?:js|css|woff2?|png|jpg|jpeg|svg|ico|json)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'static-assets',
                expiration: {
                  maxEntries: 300,
                  maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              // Cache HTML navigation requests (UI shell)
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkFirst', // Try network, fall back to cache
              options: {
                cacheName: 'html-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
                networkTimeoutSeconds: 5, // Fallback to cache if network fails fast
                cacheableResponse: { statuses: [0, 200] },
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
