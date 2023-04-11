self.importScripts('./data/moves.js');

// Files to cache
const cacheName = 'movie_pwa_1';
const appShellFiles = [
  './',
  './index.html',
  './app.js',
  './style.css',
  './fonts/graduate.eot',
  './fonts/graduate.ttf',
  './fonts/graduate.woff',
  './favicon-16x16.png',
  './img/futurefilm.png',
  './img/bgheader.jpg',
  './img/bgmain.jpg',
  './icons/favicon-16x16.png',
  './icons/favicon-32x32.png',
  './icons/android-chrome-192x192.png',
  './icons/android-chrome-512x512.png',
];
const moviesImages = [];
for (let i = 0; i < movies.length; i++) {
  moviesImages.push(`./data/img/${movies[i].slug}.webp`);
}
const contentToCache = appShellFiles.concat(moviesImages);

//=======================================Service Worker========================================
// Installing Service Worker
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(contentToCache);
  })());
});

// Fetching content using Service Worker
self.addEventListener('fetch', (e) => {
    // Cache http and https only, skip unsupported chrome-extension:// and file://...
    if (!(
       e.request.url.startsWith('http:') || e.request.url.startsWith('https:')
    )) {
        return; 
    }

  e.respondWith((async () => {
    const r = await caches.match(e.request);
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) return r;
    const response = await fetch(e.request);
    const cache = await caches.open(cacheName);
    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
    return response;
  })());
});
