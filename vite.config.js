import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path-browserify';
import tsConfigPaths from 'vite-tsconfig-paths';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
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
      tsConfigPaths({ projects: ['./tsconfig.json'] }),
      TanStackRouterVite({ autoCodeSplitting: true }),
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        strategies: 'generateSW',
        srcDir: 'public',
        filename: 'sw.js',
        manifestFilename: 'manifest.json',
        manifest: {
          name: 'Buddhaword',
          short_name: 'Buddhaword',
          description: 'ຄຳສອນພຣະພຸດທະເຈົ້າ',
          theme_color: '#FFAF5D',
          background_color: '#FFFFFF',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          icons: [
            {
              src: '/images/logo.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/images/logo.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/images/maskable-icon.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB limit
          globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
          navigateFallbackDenylist: [/^\/api\//], // Exclude API calls from offline cache
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/buddhaword\.netlify\.app\/sutra/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'sutra-cache',
                expiration: { maxEntries: 10, maxAgeSeconds: 7 * 24 * 60 * 60 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 30 * 24 * 60 * 60,
                },
              },
            },
            {
              urlPattern: /\.(?:js|css)$/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-resources',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 7 * 24 * 60 * 60,
                },
              },
            },
            {
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'pages-cache',
                expiration: { maxEntries: 20, maxAgeSeconds: 7 * 24 * 60 * 60 },
              },
            },
          ],
        },
      }),
    ],
    build: {
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: { main: 'index.html', sw: 'src/sw.js' },
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
