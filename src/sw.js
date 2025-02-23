const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/', // Cache the root
  '/index.html',
  '/assets/index.js', // Adjust based on your build output
  '/assets/index.css', // Adjust based on your build output
  // Add more static assets as needed
];

// Install event: Cache resources when the service worker is installed
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache and storing assets');
      return cache.addAll(urlsToCache);
    })
  );
  // Force the waiting service worker to activate immediately
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
  // Take control of the page immediately
  self.clients.claim();
});

// Fetch event: Serve from cache first, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found, otherwise fetch from network
      return (
        response ||
        fetch(event.request).then((networkResponse) => {
          // Optionally cache new responses dynamically
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
