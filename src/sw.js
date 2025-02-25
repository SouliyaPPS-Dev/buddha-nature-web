importScripts('/workbox-sw.js');
importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

if (workbox) {
  console.log('✅ Workbox is loaded!');

  // Precache built files & offline.html for offline mode
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // Add offline fallback page
  workbox.precaching.precacheAndRoute(['/offline.html']);

  // Ensure navigation requests work offline (for SPA)
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
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

  // Offline support - serve offline.html when network fails
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/offline.html')) // Fallback to offline UI
    );
  });

  // Install service worker & cache essential assets
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('buddhaword-cache').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/images/logo.png',
          '/offline.html', // Offline fallback page
        ]);
      })
    );
    self.skipWaiting();
  });

  // Take control immediately after activation
  self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });

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
