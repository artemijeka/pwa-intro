const staticCacheName = 's-app-v-3';
const dynamicCacheName = 'd-app-v-3';

const assetUrls = [
  '/index.html',
  '/js/app.js',
  '/css/styles.css',
  '/offline.html',
];

self.addEventListener('install', async (event) => {
  // console.log('[SW]: install');
  const cache = await caches.open(staticCacheName);
  await cache.addAll(assetUrls);
});

self.addEventListener('activate', async (event) => {
  // console.log('[SW]: activate');
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter(name => name !== staticCacheName)
      .filter(name => name !== dynamicCacheName)
      .map(name => caches.delete(name))
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;//диструктуризация

  const url = new URL(request.url);
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
  // console.log('Fetch', event.request.url);
});



async function cacheFirst(request) {
  const cached = await caches.match(request);//кэширование статических файлов
  return cached ?? await fetch(request);
}



async function networkFirst(request) {
  const cache = await caches.open(dynamicCacheName);

  try {
    const response = await fetch(request);
    await cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    return cached ?? await caches.match('/offline.html');
  }
}



