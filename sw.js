const CACHE_NAME = 'mep-dp-v2.1';
const ASSETS = [
  './',
  './index.html',
  './responsive.css',
  './fondo.png',
  './icon-512.png',
  './paso1.html',
  './paso2.html',
  './paso3.html',
  './paso4.html',
  './paso5.html',
  './paso6.html',
  './paso7.html',
  './paso8.html',
  './paso9.html',
  './anexos.html',
  './Logo/Henderson Sans Basic Bold.ttf',
  './Logo/Henderson Sans Basic Light.ttf',
  './Logo/Henderson Sans Basic SemiBd.ttf',
  './Logo/Logo_MINISTERIO DE -EDUCACION PUBLICA- 2 CC_MINISTERIO DE -EDUCACIÓN PÚBLICA-.png'
];

// Instala el Service Worker y cachea los activos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Cacheando activos...');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activa el Service Worker y limpia caches viejas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('Service Worker: Borrando cache vieja', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// Responde con recursos de la cache si están disponibles
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
