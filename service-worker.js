let fileCacheName = 'files';

self.addEventListener('install', event => {
    console.log('Service worker installing...');
    event.waitUntil(
        caches.open(fileCacheName).then(function(cache) {
          return cache.addAll(
            [
              '/images/small-icon.png',
              '/images/large-icon.png',
              '/index.html',
              '/index.js',
              '/worker.js',
              '/service-worker.js',
              '/lib/knockout.js'
            ]
          );
        })
      );
});
  
self.addEventListener('activate', event => {
    console.log('Service worker activating...');
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => {
          console.log('[Service Worker] Fetching resource: '+e.request.url);
      return r || fetch(e.request).then((response) => {
                return caches.open(fileCacheName).then((cache) => {
          console.log('[Service Worker] Caching new resource: '+e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});
