const CACHE_NAME = 'fintjam-v1';

// File statis yang di-cache untuk offline
const STATIC_ASSETS = [
  '/login.html',
  '/index.html',
  '/transactions.html',
  '/riwayat.html',
  '/settings.html',
  '/limit-setup.html',
  '/assets/css/style.css',
  '/assets/js/api.js',
  '/assets/js/auth.js',
  '/assets/js/ui.js',
];

// Install — cache semua static assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate — hapus cache lama
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first untuk API, cache first untuk static
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // API calls — selalu ke network, jangan di-cache
  if (url.hostname.includes('railway.app')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // CDN (Tailwind, fonts, icons) — network first, fallback cache
  if (url.hostname !== self.location.hostname) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  // Static assets — cache first, fallback network
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        return res;
      });
    })
  );
});
