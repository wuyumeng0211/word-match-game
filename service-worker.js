const CACHE_NAME = 'word-match-game-v16';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './skin-pixel.css',
  './assets/fonts/press-start-2p-latin.woff2',
  './skin-pixel-companions.css',
  './config.js',
  './words-data.js',
  './sound.js',
  './game.js',
  './game-save.js',
  './game-colors.js',
  './game-companion.js',
  './game-shop.js',
  './game-board.js',
  './game-modes.js',
  './game-learning.js',
  './game-ui.js',
  './main.js',
  './word-match-game.html',
  './manifest.json',
  './icon.svg',
  './assets/companions/pixel/dino-l1.png',
  './assets/companions/pixel/dino-l2.png',
  './assets/companions/pixel/dino-l3.png',
  './assets/companions/pixel/dino-l4.png',
  './assets/companions/pixel/dino-l5.png',
  './assets/companions/pixel/dino-l6.png',
  './assets/companions/pixel/mecha-l1.png',
  './assets/companions/pixel/mecha-l2.png',
  './assets/companions/pixel/mecha-l3.png',
  './assets/companions/pixel/mecha-l4.png',
  './assets/companions/pixel/mecha-l5.png',
  './assets/companions/pixel/mecha-l6.png',
  './assets/companions/pixel/princess-l1.png',
  './assets/companions/pixel/princess-l2.png',
  './assets/companions/pixel/princess-l3.png',
  './assets/companions/pixel/princess-l4.png',
  './assets/companions/pixel/princess-l5.png',
  './assets/companions/pixel/princess-l6.png',
  './assets/companions/dino.png',
  './assets/companions/mecha.png',
  './assets/companions/princess.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const acceptsHtml = event.request.headers.get('accept')?.includes('text/html');
  if (event.request.mode === 'navigate' || acceptsHtml) {
    event.respondWith(
      fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      }).catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
