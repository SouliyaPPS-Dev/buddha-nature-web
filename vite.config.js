import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path-browserify';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import tsConfigPaths from 'vite-tsconfig-paths';
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
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      TanStackRouterVite({ autoCodeSplitting: true }),
      react(),
      VitePWA({
        registerType: 'prompt', // Changed to prompt to give users control
        devOptions: { enabled: true }, // Enables service worker in development
        injectRegister: 'auto',
        strategies: 'injectManifest', // Use injectManifest for more control
        srcDir: 'public',
        filename: 'sw.js', // Use our custom service worker
        manifestFilename: 'manifest.json',
        injectManifest: {
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB limit
          globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        },
        workbox: {
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//], // Don't use fallback for API routes
        },
        manifest: {
          name: 'Buddhaword',
          short_name: 'Buddhaword',
          description: 'The Word of Buddha',
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
          shortcuts: [
            {
              name: 'Home',
              url: '/',
              icons: [
                {
                  src: '/images/home-icon.png',
                  sizes: '96x96',
                  type: 'image/png',
                },
              ],
            },
            {
              name: 'Offline Content',
              url: '/cache-management',
              icons: [
                {
                  src: '/images/offline-icon.png',
                  sizes: '96x96',
                  type: 'image/png',
                },
              ],
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
