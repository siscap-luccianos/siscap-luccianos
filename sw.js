// v2.1 — cache buster
const VERSION = '2.1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window' })
        .then(clients => clients.forEach(c => c.navigate(c.url)))
      )
  );
});

// No cachear nada — siempre red
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request, { cache: 'no-store' }).catch(() => fetch(e.request))
  );
});
