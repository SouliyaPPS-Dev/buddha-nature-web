importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

if (workbox) {
  console.log('Service Worker Loaded ✔️');

  // 🔹 Precache UI Shell
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // 🔹 Cache UI pages & fallback to cache when offline
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.CacheFirst({
      cacheName: 'html-cache',
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

  // 🔹 Cache static assets (JS, CSS, Fonts, Images)
  workbox.routing.registerRoute(
    ({ request }) =>
      ['script', 'style', 'font', 'image'].includes(request.destination),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-assets',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    })
  );

  // 🔹 Cache API responses for 7 days (Fallback to cache when offline)
  workbox.routing.registerRoute(
    /^https:\/\/example-api\.com\/.*/,
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache',
      networkTimeoutSeconds: 5,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        }),
      ],
    })
  );

  // 🔹 Serve `/offline.html` when no network
  self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request).catch(() => caches.match('/offline.html'))
      );
    }
  });

  // 🔹 Activate SW immediately
  self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });
} else {
  console.error('❌ Workbox failed to load');
}
