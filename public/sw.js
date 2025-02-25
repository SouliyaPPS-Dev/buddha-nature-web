importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

const CACHE_NAME = 'buddhaword-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/logo.png',
  '/src/main.tsx', // Ensure this is accessible
  '/styles.css', // If you have a CSS file
];

if (workbox) {
  console.log('✅ Workbox is loaded!');

  // 🔹 Precache all built files
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // 🔹 Cache UI assets efficiently (Load from **CACHE FIRST** when offline)
  workbox.routing.registerRoute(
    /\.(?:js|css|png|jpg|jpeg|svg|webp|ico|woff2|woff|ttf|eot)$/,
    new workbox.strategies.CacheFirst({
      cacheName: 'static-assets',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
        }),
      ],
    })
  );

  // 🔹 Ensure UI pages (HTML) always work offline
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'html-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for 7 Days
        }),
      ],
    })
  );

  // 🔹 Improved API Caching Strategy (Fix Offline Problems)
  workbox.routing.registerRoute(
    ({ url }) => url.origin.includes('example-api.com'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache',
      networkTimeoutSeconds: 5,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        }),
      ],
    })
  );

  // 🔹 Serve `/index.html` when a route fails (ALL Pages work even when offline)
  self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request).catch(() => caches.match('/index.html'))
      );
    }
  });

  // 🔹 Immediately take control of the page
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      (async () => {
        await self.clients.claim();

        // 🗑 Clear old caches that are not in use
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                ![
                  'api-cache',
                  'static-assets',
                  'html-cache',
                  CACHE_NAME,
                ].includes(cacheName)
            )
            .map((cacheName) => caches.delete(cacheName))
        );

        console.log('✅ Old caches cleaned up');
      })()
    );
  });

  // 🔹 Force Service Worker Updates Immediately
  self.skipWaiting();

  // 🔹 Send Message to Notify Clients about Online/Offline Status
  self.addEventListener('message', (event) => {
    if (event.data === 'check-connection') {
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'NETWORK_STATUS',
            online: navigator.onLine,
          });
        });
      });
    }
  });
} else {
  console.error('❌ Workbox failed to load.');
}

// 🔹 Manual Caching for Specific Files (in addition to Workbox)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('🔹 Caching additional assets');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});