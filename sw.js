const CACHE_NAME = 'quick-image-editor-cache-v1';
const urlsToCache = [
  './',
  'index.html',
  'manifest.json',
  'icon-1440.png',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.js',
  'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
          .catch(err => {
            console.error('Failed to cache one or more resources during install:', err);
          });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});