self.addEventListener('install', event => {
    console.log('Service worker installing...');
    event.waitUntil(
        caches.open('files').then(function(cache) {
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

self.addEventListener('fetch', function(event) {
    console.log('fetch event' + event);
    event.respondWith(caches.match(event.request));
  });
