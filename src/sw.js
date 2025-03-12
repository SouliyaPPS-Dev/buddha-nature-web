import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute, setDefaultHandler } from 'workbox-routing';
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// ✅ Precache essential assets (from Vite PWA)
precacheAndRoute(self.__WB_MANIFEST || []);

// ✅ Cache static resources (JS, CSS, fonts)
registerRoute(
  ({ request }) => ['script', 'style', 'font'].includes(request.destination),
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
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }), // 30 days
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// ✅ Cache all navigation requests (HTML pages) for offline refresh
registerRoute(
  ({ request }) => request.mode === 'navigate', // All pages
  new NetworkFirst({
    cacheName: 'html-pages',
    plugins: [
      new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 7 * 24 * 60 * 60 }), // Cache pages for 7 days
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// ✅ Cache API responses for offline access to dynamic data
registerRoute(
  ({ url }) =>
    url.origin === self.location.origin && url.pathname.startsWith('/api'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 60 }), // 1 hour
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// ✅ Serve an offline fallback page when no network
const OFFLINE_FALLBACK_URL = '/offline.html';
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('offline-cache').then((cache) => {
      return cache.add(OFFLINE_FALLBACK_URL);
    })
  );
});

// ✅ If offline, serve a cached page or fallback page
setDefaultHandler(async ({ event }) => {
  if (event.request.mode === 'navigate') {
    try {
      return await fetch(event.request);
    } catch {
      return caches.match(event.request) || caches.match(OFFLINE_FALLBACK_URL);
    }
  }
  return fetch(event.request);
});
