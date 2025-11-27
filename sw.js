// sw.js - Image Editor (Dynamic Version)

const CACHE_NAME = 'image-editor-dynamic-v3';

// نخزن فقط ملف الواجهة لضمان نجاح التثبيت السريع
const urlsToCache = [
  './',
  'index.html',
  'manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then(networkResponse => {
          // التحقق من صحة الاستجابة
          // ملاحظة: هنا نسمح بـ 'cors' لأنك تستخدم مكتبات خارجية (CDNs)
          if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
            return networkResponse;
          }

          // تخزين الملف (سواء كان صورة أو سكريبت خارجي)
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            if (event.request.method === 'GET' && !event.request.url.startsWith('chrome-extension')) {
                cache.put(event.request, responseToCache);
            }
          });

          return networkResponse;
        });
      })
  );
});