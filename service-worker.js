const cacheName = 'app-v-1';

const assetUrls = [
  '/index.html',
  '/js/app.js',
  '/css/styles.css',
];

self.addEventListener('install', async (event) => {
  console.log('[SW]: install');

  const cache = await caches.open(cacheName);
  await cache.addAll(assetUrls);
});

self.addEventListener('activate', async (event) => {
  console.log('[SW]: activate');

  const cacheNames = await caches.keys();
  await Promise.all();
});

self.addEventListener('fetch', event => {
  console.log('Fetch', event.request.url);

  event.respondWith(cacheFirst(event.request));//получаем кэш
});



async function cacheFirst(request) {
  const cached = await caches.match(request);//кэширование статических файлов
  return cached ?? await fetch(request); 
}