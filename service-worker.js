
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('vbook-cache-v1').then(cache => cache.addAll(['/','/index.html','/style.css','/script.js']))
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(resp => resp || fetch(event.request)));
});
