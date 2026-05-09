// Service Worker minimal — hanya untuk PWA installable
// Tidak cache apapun untuk menghindari redirect loop

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

// Semua request langsung ke network — tidak ada caching
self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request));
});
