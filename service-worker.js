// service-worker.js

const CACHE_NAME = 'shadowing-app-cache-v1';
const urlsToCache = [
  'index.html',
  'manifest.json',
  // İkon URL'lerini de buraya ekleyebilirsiniz, ama şimdilik temel dosyalar yeterli.
];

// 1. Install - Cache'i oluştur
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Fetch - Cache'ten sun
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache'te varsa oradan döndür
        if (response) {
          return response;
        }
        // Cache'te yoksa, ağı (network) kullan
        return fetch(event.request);
      }
    )
  );
});

// 3. Activate - Eski cache'leri temizle
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
    })
  );

});
// service-worker.js dosyasının en altına ekleyin

self.addEventListener('notificationclick', event => {
  console.log('Notification click received.');
  // Bu, Service Worker'ın daha uzun süre aktif kalmasını sağlar.
  if (event.action === 'play' || event.action === 'pause') {
    // Media Session işlemleri tetiklenebilir, ancak sadece Service Worker'ı aktif tutmak yeterlidir.
  }
  // Bildirim kapatılır.
  event.notification.close();
});
