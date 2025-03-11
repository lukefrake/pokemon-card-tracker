const API_CACHE_NAME = 'pokemon-api-cache-v1';

// Get the base path from the service worker's location
const getBasePath = () => {
  const path = self.location.pathname;
  const basePath = path.substring(0, path.lastIndexOf('/'));
  return basePath;
};

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(API_CACHE_NAME).then(() => {
      console.log('API cache created successfully');
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== API_CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        );
      }),
      // Take control of all pages immediately
      self.clients.claim()
    ])
  );
});

self.addEventListener('message', (event) => {
  console.log('Service worker received message:', event.data);
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only handle Pokemon TCG API requests
  if (url.hostname === 'api.pokemontcg.io') {
    event.respondWith(
      caches.open(API_CACHE_NAME)
        .then(async (cache) => {
          try {
            // Try to get from cache first
            const cachedResponse = await cache.match(event.request);
            if (cachedResponse) {
              return cachedResponse;
            }

            // If not in cache, get from network
            const networkResponse = await fetch(event.request.clone());
            
            // Cache the response if it's valid
            if (networkResponse.ok) {
              await cache.put(event.request, networkResponse.clone());
            }
            
            return networkResponse;
          } catch (error) {
            console.error('Fetch failed:', error);
            throw error;
          }
        })
    );
  } else {
    event.respondWith(fetch(event.request));
  }
}); 