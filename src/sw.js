importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

if (workbox) {
  console.log('✅ Workbox is loaded!');

  // 🔹 Precache all built files
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // 🔹 Cache UI assets efficiently
  workbox.routing.registerRoute(
    /\.(?:js|css|png|jpg|jpeg|svg|webp|ico|woff2|woff|ttf|eot)/,
    new workbox.strategies.StaleWhileRevalidate({
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

  // 🔹 Ensure UI (HTML Pages) can load offline
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'html-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
        }),
      ],
    })
  );

  // 🔹 Cache API Responses Properly for Offline Use
  workbox.routing.registerRoute(
    /^https:\/\/example-api\.com\/.*/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'api-cache',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
        }),
      ],
    })
  );

  // 🔹 Serve `/index.html` when a request fails (fallback for offline mode)
  self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request).catch(() => caches.match('/index.html'))
      );
    }
  });

  // 🔹 Immediately take control of the page
  self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });
} else {
  console.error('❌ Workbox failed to load.');
}
