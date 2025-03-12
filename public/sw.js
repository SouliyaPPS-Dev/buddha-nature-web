import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// ✅ Precache all assets from Vite PWA
precacheAndRoute(self.__WB_MANIFEST || []);

// ✅ Cache static resources (JS, CSS)
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

// ✅ Cache images using CacheFirst strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// ✅ Precache all assets from Vite PWA
precacheAndRoute(self.__WB_MANIFEST || []);

// ✅ Dynamically Cache All Images Found in Project
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('images-cache').then(async (cache) => {
      const cachedRequests = (self.__WB_MANIFEST || [])
        .map(entry => entry.url)
        .filter(url => url.match(/\.(png|jpg|jpeg|svg|gif|webp)$/)); // Only images

      await cache.addAll(cachedRequests);
    })
  );
});

// ✅ Serve Images from Cache or Network if Not Cached
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200, // Store up to 200 images
        maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
      }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// ✅ Provide an Offline Fallback for Images
self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || caches.match('/images/offline-image.png'); // Fallback image
      })
    );
    return;
  }
});

// ✅ Cache `/sutra` page using NetworkFirst strategy
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
