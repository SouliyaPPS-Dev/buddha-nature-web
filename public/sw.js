importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js' // Updated to newer version
);

if (workbox) {
  console.log('Workbox loaded successfully');

  // Precache manifest entries
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || [], {
    ignoreURLParametersMatching: [/.*/], // Cache regardless of query params
  });

  workbox.core.setCacheNameDetails({
    prefix: 'buddhaword',
    suffix: 'v1',
  });

  // Clean up old caches
  workbox.precaching.cleanupOutdatedCaches();

  // Immediate activation
  self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });

  // Handle installation
  self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
  });

  // Comprehensive asset caching
  workbox.routing.registerRoute(
    /\.(?:js|css|woff2?|png|jpg|jpeg|gif|svg|ico|webp|avif)$/i,
    new workbox.strategies.CacheFirst({
      cacheName: 'static-assets',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 60, // 60 days
          purgeOnQuotaError: true,
        }),
      ],
    })
  );

  // HTML navigation caching
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
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
      networkTimeoutSeconds: 10,
    })
  );

  // Offline fallback
  self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request).catch(() =>
          caches.match('/index.html', {
            cacheName: 'html-cache',
          })
        )
      );
    }
  });
} else {
  console.error('Workbox failed to load');
}

// Skip caching for specific routes if needed
self.addEventListener('fetch', (event) => {
  if (event.request.url.endsWith('/robots.txt')) {
    event.respondWith(fetch(event.request));
    return;
  }
});
