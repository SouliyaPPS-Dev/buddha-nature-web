importScripts('/workbox-sw.js');

if (workbox) {
  console.log('✅ Workbox is loaded!');

  // Precache all built files for offline mode
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // Ensure navigation requests work offline (for SPA)
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.CacheFirst({
      cacheName: 'pages-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
        }),
      ],
    })
  );

  // Cache static files (CSS, JS, images, fonts)
  workbox.routing.registerRoute(
    /\.(?:js|css|png|jpg|jpeg|svg|webp|ico|woff2|woff|ttf|eot)$/i,
    new workbox.strategies.CacheFirst({
      cacheName: 'static-assets',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 500,
          maxAgeSeconds: 60 * 24 * 60 * 60, // Cache for 60 days
        }),
      ],
    })
  );

  // Cache API responses (adjust the URL to your API)
  workbox.routing.registerRoute(
    ({ url }) => url.origin.includes('example-api.com'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache',
      networkTimeoutSeconds: 10,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for 7 days
        }),
      ],
    })
  );

  // Fallback for SPA routing
  workbox.routing.setDefaultHandler(
    new workbox.strategies.NetworkFirst({
      cacheName: 'spa-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 5,
          maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
        }),
      ],
    })
  );

  self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request).catch(() => caches.match('/index.html')) // Fallback to cache
      );
    }
  });

  // Take control immediately after activation
  self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });

  // Update immediately
  self.skipWaiting();

  // Notify clients of network status
  self.addEventListener('message', (event) => {
    if (event.data === 'check-connection') {
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) =>
          client.postMessage({
            type: 'NETWORK_STATUS',
            online: navigator.onLine,
          })
        );
      });
    }
  });
} else {
  console.error('❌ Workbox failed to load.');
}
