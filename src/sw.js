importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

if (workbox) {
  console.log('✅ Workbox loaded successfully!');

  // 🔹 Precache All Build Files
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // 🔹 Cache All UI Pages (HTML)
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages-cache',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50, // Cache last 50 visited pages
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
        }),
      ],
    })
  );

  // 🔹 Cache Static Assets (JS, CSS, Images, Icons, Fonts)
  workbox.routing.registerRoute(
    /\.(?:js|css|png|jpg|jpeg|svg|webp|ico|woff2|woff|ttf|eot)/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-assets',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 200, // Keep 200 static files in cache
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  // 🔹 Cache API Requests (Optional: Replace `example-api.com`)
  workbox.routing.registerRoute(
    /^https:\/\/example-api\.com\/.*/,
    new workbox.strategies.NetworkFirst({
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

  // 🔹 Fallback for Offline Mode (Serve `index.html`)
  self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request).catch(() => caches.match('/index.html'))
      );
    }
  });

  // 🔹 Activate New SW Immediately
  self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });
} else {
  console.error('❌ Workbox failed to load.');
}
