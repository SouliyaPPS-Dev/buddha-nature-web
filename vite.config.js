import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import path from "path-browserify"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import tsConfigPaths from "vite-tsconfig-paths"
import loadEnv from "./loadEnv"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base: "/",
    resolve: {
      alias: {
        path: "path-browserify",
        "@": path.resolve(__dirname, "src"),
      },
    },
    define: {
      "process.env": env,
    },
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      TanStackRouterVite({ autoCodeSplitting: true }),
      react(),
      VitePWA({
        registerType: "autoUpdate",
        devOptions: { enabled: true },
        strategies: "generateSW",
        srcDir: "public",
        filename: "sw.js",
        manifestFilename: "manifest.json",
        manifest: {
          name: "Buddhaword",
          short_name: "Buddhaword",
          description: "The Word of Buddha",
          theme_color: "#FFAF5D", // ✅ This fixes the warning
          background_color: "#FFFFFF",
          display: "standalone",
          orientation: "portrait",
          start_url: "/",
          icons: [
            {
              src: "/images/logo.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/images/logo.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/images/maskable-icon.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB limit
          globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
          navigateFallback: "/offline.html",
          navigateFallbackDenylist: [/^\/api\//], // Exclude API calls from offline cache
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/buddhaword\.netlify\.app\/sutra/,
              handler: "NetworkFirst",
              options: {
                cacheName: "sutra-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
              handler: "CacheFirst",
              options: {
                cacheName: "images-cache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                },
              },
            },
            {
              urlPattern: /\.(?:js|css)$/,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "static-resources",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
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
        input: {
          main: 'index.html',
          sw: 'src/sw.js' // Ensure the service worker is included
        },
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id.split("node_modules/")[1].split("/")[0]
            }
          },
        },
      },
    },
  }
})

