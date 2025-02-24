importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

if (workbox) {
  console.log('✅ Workbox is loaded!');

  // 🔹 Precache all build files and ensure UI loads offline
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // 🔹 Cache UI assets efficiently (Load from **CACHE FIRST** when offline)
  workbox.routing.registerRoute(
    /\.(?:js|css|png|jpg|jpeg|svg|webp|ico|woff2|woff|ttf|eot)/,
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

  // 🔹 Cache UI pages (`index.html`) to always work offline
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.CacheFirst({
      cacheName: 'html-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for 7 Days
        }),
      ],
    })
  );

  // 🔹 Cache API Responses for Offline Use
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
          maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for 7 Days
        }),
      ],
    })
  );

  // 🔹 Serve `/index.html` when a request fails (Required for SPA and Offline Mode)
  self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request).catch(() => caches.match('/index.html'))
      );
    }
  });

  // 🔹 Immediately update & activate new service worker
  self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });

  // 🔹 Force service worker updates immediately
  self.skipWaiting();

  // 🔹 Send Online/Offline Status to Clients in Real-Time
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

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then((registration) => {
      console.log('✅ Service Worker Registered:', registration);

      // 🔹 Listen for messages from service worker
      navigator.serviceWorker.onmessage = (event) => {
        if (event.data && event.data.type === 'NETWORK_STATUS') {
          updateNetworkStatus(event.data.online);
        }
      };

      // 🔹 Send a message to SW to check connection
      registration.active?.postMessage('check-connection');
    })
    .catch((error) =>
      console.error('❌ Service Worker Registration Failed:', error)
    );
}

// 🔹 Function to update UI when offline/online
function updateNetworkStatus(isOnline) {
  const offlineBanner = document.getElementById('offline-banner');

  if (!isOnline) {
    console.warn('⚠️ You are offline! Using cached data.');
    offlineBanner.style.display = 'block';
  } else {
    console.log('✅ Online Mode Active');
    offlineBanner.style.display = 'none';
  }
}

// 🔹 Listen for Online & Offline Events from Browser
window.addEventListener('online', () => updateNetworkStatus(true));
window.addEventListener('offline', () => updateNetworkStatus(false));