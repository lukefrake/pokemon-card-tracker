const API_CACHE_NAME = 'pokemon-api-cache-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(API_CACHE_NAME)
  );
});

self.addEventListener('activate', () => {
  console.log('Service Worker activating.');
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle Pokemon TCG API requests
  if (url.hostname === 'api.pokemontcg.io') {
    console.log('Intercepting Pokemon API request:', url.pathname);
    
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
          const networkResponse = await fetch(event.request.clone());
          
          // Cache the response if it's valid
          if (networkResponse.ok) {
            console.log('Caching new response:', url.pathname);
            await cache.put(event.request, networkResponse.clone());
          }
          
          return networkResponse;
        })
        .catch(error => {
          console.error('Service Worker error:', error);
          throw error;
        })
    );
  }
}); 