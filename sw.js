const CACHE = 'brett-v1';
const ASSETS = ['./', './index.html', './favicon.svg', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Stream video requests directly — don't cache large mp4 files
  if (e.request.url.endsWith('.mp4')) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
