import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Precache all assets from Vite PWA
precacheAndRoute(self.__WB_MANIFEST || []);

// Cache static resources (JS, CSS)
registerRoute(
  ({ request }) =>
    request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 7 * 24 * 60 * 60 }), // 7 days
    ],
  })
);

// Cache images using CacheFirst strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }), // 30 days
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// Cache `/sutra` page using NetworkFirst strategy
registerRoute(
  ({ url }) => url.pathname.startsWith('/sutra'),
  new NetworkFirst({
    cacheName: 'sutra-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 7 * 24 * 60 * 60 }), // 7 days
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// Offline fallback page for UI when offline
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('sutra-cache').then((cache) => {
      return cache.addAll([
        '/offline.html', // Create this page to show when offline
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/offline.html'))
    );
  }
});
