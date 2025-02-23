// src/sw.js
const CACHE_NAME = 'buddhaword-cache-v1';

// Precache manifest injected by vite-plugin-pwa
const urlsToCache = [
  '/',
  '/index.html',
  ...self.__WB_MANIFEST.map((entry) => entry.url).filter(Boolean), // Ensure only valid URLs
];

// Install event: Cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('Service Worker: Caching assets');

      for (const url of urlsToCache) {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn(`Failed to cache ${url}:`, err);
        }
      }
    })
  );
  self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim(); // Take control of clients
});

// Fetch event: Serve cached UI offline, fallback to network
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Handle navigation requests (HTML/UI)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('/index.html').then((response) => {
          return response || Promise.reject('No cached UI available');
        })
      )
    );
  } else {
    // Handle other assets (JS, CSS, images, etc.)
    event.respondWith(
      caches
        .match(request)
        .then((cachedResponse) => {
          // Return cached response if available
          if (cachedResponse) {
            return cachedResponse;
          }
          // Otherwise fetch from network and cache
          return fetch(request).then((networkResponse) => {
            if (request.method === 'GET' && networkResponse.ok) {
              return caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, networkResponse.clone());
                return networkResponse;
              });
            }
            return networkResponse;
          });
        })
        .catch(() => {
          // Offline fallback for non-navigation requests (optional)
          return caches.match('/index.html'); // Fallback to UI shell
        })
    );
  }
});

// Handle skipWaiting messages from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
