const API_CACHE_NAME = 'pokemon-api-cache-v1';

// Get the base path from the service worker's location
const getBasePath = () => {
  const path = self.location.pathname;
  console.log('Service worker path:', path);
  const basePath = path.substring(0, path.lastIndexOf('/'));
  console.log('Calculated base path:', basePath);
  return basePath;
};

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  // Skip waiting to activate immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(API_CACHE_NAME).then(() => {
      console.log('API cache created successfully');
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  // Clean up old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      console.log('Existing caches:', cacheNames);
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== API_CACHE_NAME)
          .map(cacheName => {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
});

self.addEventListener('message', (event) => {
  console.log('Service worker received message:', event.data);
  if (event.data.type === 'CLAIM_CLIENTS') {
    console.log('Claiming clients');
    self.clients.claim();
  }
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  console.log('Fetch event for:', url.pathname);
  
  // Only handle Pokemon TCG API requests
  if (url.hostname === 'api.pokemontcg.io') {
    console.log('Handling Pokemon TCG API request:', url.pathname);
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
            } else {
              console.log('Not caching error response:', networkResponse.status);
            }
            
            return networkResponse;
          } catch (error) {
            console.error('Fetch failed:', error);
            throw error;
          }
        })
    );
  }
  // Pass through all other requests
  else {
    console.log('Passing through request:', url.pathname);
    event.respondWith(fetch(event.request));
  }
}); 