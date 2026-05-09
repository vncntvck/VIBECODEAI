// Force unregister semua service worker dan hapus cache
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', async () => {
  // Hapus semua cache
  const keys = await caches.keys();
  await Promise.all(keys.map(k => caches.delete(k)));
  // Unregister diri sendiri
  const regs = await self.registration.unregister();
  self.clients.claim();
});
self.addEventListener('fetch', (e) => e.respondWith(fetch(e.request)));
