// src/sw.js
const CACHE_NAME = 'my-pwa-cache-v1';

// Precache manifest will be injected here by vite-plugin-pwa
const urlsToCache = [
  '/', // Cache the root
  '/index.html',
  // Add more static assets if needed
  ...self.__WB_MANIFEST, // This is where the plugin injects the manifest
];

// Install event: Cache resources when the service worker is installed
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache and storing assets');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate event: Clean up old caches if needed
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
  self.clients.claim();
});

// Fetch event: Serve from cache first, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((networkResponse) => {
          if (event.request.method === 'GET') {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }
          return networkResponse;
        })
      );
    })
  );
});

// Handle updates from the app (optional)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
