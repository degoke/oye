const shellCache = 'oye.shell.v1';
self.addEventListener('install', event => {
  event.waitUntil((async () => { const cache = await caches.open(shellCache); const response = await fetch('/offline-assets.json', { cache: 'no-store' }); if (!response.ok) throw new Error('Offline shell unavailable'); const assets = await response.json(); await cache.addAll(['/', ...assets]); await self.skipWaiting(); })());
});
self.addEventListener('activate', event => { event.waitUntil((async () => { for (const key of await caches.keys()) if (key.startsWith('oye.shell.') && key !== shellCache) await caches.delete(key); await self.clients.claim(); })()); });
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // API, learner data, media and other origins are never cached here.
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api') || !(event.request.mode === 'navigate' || ['document', 'script', 'style', 'font'].includes(event.request.destination) || /^\/assets\/[^/]+\.(js|css|woff2?)$/.test(url.pathname))) return;
  event.respondWith((async () => { const cache = await caches.open(shellCache); if (event.request.mode === 'navigate') { try { const response = await fetch(event.request); if (response.ok) await cache.put('/', response.clone()); return response; } catch { return await cache.match('/') || Response.error(); } } const cached = await cache.match(event.request, { ignoreVary: true }); if (cached) return cached; const response = await fetch(event.request); if (response.ok) await cache.put(event.request, response.clone()); return response; })());
});
