// Service worker: сторінка працює офлайн з останнім знімком; state.js завжди береться з мережі, якщо вона є.
const CACHE = 'rstbr-v5';
const SHELL = ['./', 'index.html', 'style.css', 'v2.css', 'v3.css', 'app.js', 'v3.js', 'i18n.js', 'lqip.js', 'state.js', 'manifest.webmanifest', 'authors.html', 'market.html', 'pages.css', 'pages.js', 'authors.js', 'market.js', 'games.html', 'games.css', 'games.js', 'fonts.css', 'fonts/e3t4euO8T-267oIAQAu6jDQyK3nbivN04w.woff2', 'fonts/e3t4euO8T-267oIAQAu6jDQyK3nRivN04w.woff2', 'fonts/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff2', 'fonts/e3t4euO8T-267oIAQAu6jDQyK3nWivN04w.woff2', 'fonts/e3t4euO8T-267oIAQAu6jDQyK3nYivN04w.woff2', 'fonts/iJWKBXyIfDnIV7nBrXw.woff2', 'fonts/iJWKBXyIfDnIV7nDrXyi0A.woff2', 'fonts/iJWKBXyIfDnIV7nErXyi0A.woff2', 'fonts/iJWKBXyIfDnIV7nFrXyi0A.woff2', 'fonts/iJWKBXyIfDnIV7nMrXyi0A.woff2', 'fonts/iJWKBXyIfDnIV7nPrXyi0A.woff2'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // дані та власні файли: мережа → кеш; картинки Steam: кеш → мережа
  if (url.origin === location.origin) {
    e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
  } else if (/steamusercontent|steamstatic/.test(url.host)) {
    e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; })));
  }
});
