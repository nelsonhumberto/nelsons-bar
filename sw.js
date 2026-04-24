// Nelson's Bar — Service Worker
// Strategy:
//   - HTML (navigation requests): network-only with offline fallback,
//     never cached. Prevents stale HTML on installed PWAs (esp. iOS).
//   - Static assets: network-first with cache fallback for offline use.
//   - Supabase + AI APIs: pass through, never touched.

const CACHE_VERSION = 'nelsons-bar-v1.3.1';
const STATIC_ASSETS = [
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.hostname.includes('supabase.co') ||
      url.hostname.includes('openai.com') ||
      url.hostname.includes('anthropic.com')) {
    return;
  }

  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(
      fetch(req, { cache: 'no-store' }).catch(() =>
        new Response(
          '<h1 style="font-family:serif;color:#c89b3c;background:#0e0f14;padding:40px;text-align:center;">Offline</h1><p style="color:#9aa0ad;text-align:center;font-family:sans-serif;">Reconnect and refresh.</p>',
          { status: 200, headers: { 'Content-Type': 'text/html' } }
        )
      )
    );
    return;
  }

  event.respondWith(
    fetch(req).then((response) => {
      if (response && response.status === 200 && response.type === 'basic') {
        const clone = response.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(req, clone));
      }
      return response;
    }).catch(() => caches.match(req))
  );
});
