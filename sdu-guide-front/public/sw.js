const CACHE = 'sdu-guide-v1';

const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
];

/* ── install: кэшируем оболочку ── */
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE))
  );
  self.skipWaiting();
});

/* ── activate: удаляем старые кэши ── */
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* ── fetch: network-first для API, cache-first для статики ── */
self.addEventListener('fetch', (e) => {
  const url = e.request.url;

  // Пропускаем: API, карты, не-GET
  if (
    e.request.method !== 'GET' ||
    url.includes(':8000') ||
    url.includes('openstreetmap') ||
    url.includes('cartocdn') ||
    url.includes('basemaps')
  ) {
    return;
  }

  // Навигационные запросы (HTML) → всегда из сети, fallback на /
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/'))
    );
    return;
  }

  // Статические ресурсы → cache-first
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, clone));
        return res;
      });
    })
  );
});
