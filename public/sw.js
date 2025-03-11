const API_CACHE_NAME = 'pokemon-api-cache-v1';
const ASSETS_CACHE_NAME = 'assets-cache-v1';

// Get the base path from the service worker's location
const getBasePath = () => {
  const path = self.location.pathname;
  return path.substring(0, path.lastIndexOf('/'));
};

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  event.waitUntil(
    Promise.all([
      caches.open(API_CACHE_NAME),
      caches.open(ASSETS_CACHE_NAME)
    ])
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  // Clean up old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => 
            cacheName !== API_CACHE_NAME && 
            cacheName !== ASSETS_CACHE_NAME
          )
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle Pokemon TCG API requests
  if (url.hostname === 'api.pokemontcg.io') {
    event.respondWith(
      caches.open(API_CACHE_NAME)
        .then(async (cache) => {
          // Try to get from cache first
          const cachedResponse = await cache.match(event.request);
          if (cachedResponse) {
            console.log('Found in cache:', url.pathname);
            return cachedResponse;
          }

          console.log('Fetching from network:', url.pathname);
          // If not in cache, get from network
          try {
            const networkResponse = await fetch(event.request.clone());
            
            // Cache the response if it's valid
            if (networkResponse.ok) {
              console.log('Caching new response:', url.pathname);
              await cache.put(event.request, networkResponse.clone());
            }
            
            return networkResponse;
          } catch (error) {
            console.error('Fetch failed:', error);
            throw error;
          }
        })
    );
  }
  // Handle static assets
  else if (url.pathname.startsWith(getBasePath())) {
    event.respondWith(
      caches.open(ASSETS_CACHE_NAME)
        .then(async (cache) => {
          const cachedResponse = await cache.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }

          try {
            const networkResponse = await fetch(event.request);
            if (networkResponse.ok) {
              await cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          } catch (error) {
            console.error('Static asset fetch failed:', error);
            throw error;
          }
        })
    );
  }
}); 