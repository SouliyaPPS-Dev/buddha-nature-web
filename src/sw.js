importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

if (workbox) {
  console.log('✅ Workbox is loaded!');

  // ▌📌 Precache All Built Files for Offline Mode
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // ▌📌 Ensure Routes Work Offline by Caching Each Page
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.CacheFirst({
      cacheName: 'pages-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 Days
        }),
      ],
    })
  );

  // ▌📌 Cache All Static Files (CSS, JS, Images, Fonts)
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
          maxAgeSeconds: 60 * 24 * 60 * 60, // Cache for 60 Days
        }),
      ],
    })
  );

  // ▌📌 Cache API Responses for Offline Mode
  workbox.routing.registerRoute(
    ({ url }) => url.origin.includes('example-api.com'),
    new workbox.strategies.NetworkFirst({
      // Gets fresh data online, uses cache offline
      cacheName: 'api-cache',
      networkTimeoutSeconds: 10,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // Cache API for 7 Days
        }),
      ],
    })
  );

  // ▌📌 Serve `/index.html` for All Routes (Ensures React SPA works offline)
  workbox.routing.setDefaultHandler(
    new workbox.strategies.NetworkFirst({
      cacheName: 'spa-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 5,
          maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 Days
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

  // **🔹 Take Control Immediately After Activation**
  self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });

  // **🔹 Make Sure Service Worker Updates Immediately**
  self.skipWaiting();

  // **🔹 Notify Clients of Online & Offline Status**
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
