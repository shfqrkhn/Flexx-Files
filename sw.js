const CACHE_NAME = 'flexx-v3.8';
const ASSETS = [
    '/', '/index.html', '/css/styles.css',
    '/js/app.js', '/js/core.js', '/js/config.js',
    '/manifest.json'
];

self.addEventListener('install', e => e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.map(n => n !== CACHE_NAME ? caches.delete(n) : null))).then(()=>self.clients.claim())));
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('/index.html')))));