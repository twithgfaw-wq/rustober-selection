// Service worker: сторінка працює офлайн з останнім знімком; state.js завжди береться з мережі, якщо вона є.
const CACHE = 'rstbr-v7';
const SHELL = ['./', 'index.html', 'style.css', 'v2.css', 'v3.css', 'i18n.js', 'manifest.webmanifest', 'authors.html', 'market.html', 'pages.css', 'pages.js', 'authors.js', 'market.js', 'games.html', 'games.css', 'games.js', 'fonts.css', 'xmas.css', 'xmas.js', 'teaser.css', 'teaser.js', 'rustober26.js', 'workshop.html', 'workshop.css', 'workshop.js', 'fonts/04f52dd4d34a.woff2', 'fonts/3d97f0f70eb8.woff2', 'fonts/3ea3f649292a.woff2', 'fonts/423ede2473f6.woff2', 'fonts/479c87abbfbf.woff2', 'fonts/611ac5923e3d.woff2', 'fonts/7dee065f3871.woff2', 'fonts/9205197f7319.woff2', 'fonts/a6dd0290ee96.woff2', 'fonts/b2a93f0f0eb2.woff2', 'fonts/b7b482e1ae7a.woff2', 'fonts/d4c69783194a.woff2', 'fonts/df401c4fa682.woff2', 'fonts/e238fd755464.woff2', 'fonts/f673d854646d.woff2', 'fonts/f7b855c46d82.woff2'];
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
