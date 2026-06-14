// SisCap Service Worker — cache busting automático
const CACHE_NAME = 'siscap-v' + Date.now();
const FILES = ['/siscap-luccianos/index2.html'];

// Instalar — no cachear nada al instalar
self.addEventListener('install', e => {
  self.skipWaiting(); // Activar inmediatamente sin esperar
});

// Activar — limpiar cachés viejos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — siempre ir a la red primero, caché como fallback
self.addEventListener('fetch', e => {
  // Solo interceptar el HTML principal
  if (e.request.url.includes('index2.html') || e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .then(response => {
          // Si la red funciona, devolver la respuesta fresca
          return response;
        })
        .catch(() => {
          // Si no hay red, usar el caché
          return caches.match(e.request);
        })
    );
  }
});
