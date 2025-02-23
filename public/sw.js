importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js'
);

if (workbox) {
  console.log('Workbox loaded successfully');

  // Precache all assets from the manifest
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || [], {
    ignoreURLParametersMatching: [/.*/], // Cache regardless of query params
  });

  workbox.core.setCacheNameDetails({
    prefix: 'buddhaword',
    suffix: 'v1',
  });

  // Clean up old caches
  workbox.precaching.cleanupOutdatedCaches();

  // Activate immediately
  self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });

  // Cache all static assets with CacheFirst
  workbox.routing.registerRoute(
    /\.(?:js|css|woff2?|png|jpg|jpeg|gif|svg|ico|webp|avif|json)$/i,
    new workbox.strategies.CacheFirst({
      cacheName: 'static-assets',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 300, // Increased to handle more assets
          maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
          purgeOnQuotaError: true,
        }),
      ],
    })
  );

  // Cache HTML navigation with StaleWhileRevalidate for better UX
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'html-cache',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        }),
      ],
    })
  );

  // Offline fallback for navigation
  self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
      event.respondWith(
        caches.match(event.request).then((response) => {
          return (
            response ||
            fetch(event.request).catch(() =>
              caches.match('/index.html', { cacheName: 'html-cache' })
            )
          );
        })
      );
    }
  });
} else {
  console.error('Workbox failed to load');
}
