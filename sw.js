const API_CACHE_NAME = 'pokemon-api-cache-v3';
const SETS_CACHE_KEY = 'sets';
const CARDS_CACHE_PREFIX = 'cards-';

// Get the base path from the service worker's location
const getBasePath = () => {
  const path = self.location.pathname;
  console.log('Service worker path:', path);
  const basePath = path.substring(0, path.lastIndexOf('/'));
  console.log('Base path:', basePath);
  return basePath + '/'; // Ensure trailing slash
};

self.addEventListener('install', (event) => {
  console.log('Service Worker installing at:', self.location.pathname);
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(API_CACHE_NAME).then(() => {
      console.log('API cache created successfully');
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        console.log('Found caches:', cacheNames);
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== API_CACHE_NAME)
            .map(cacheName => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      // Take control of all pages immediately
      self.clients.claim().then(() => {
        console.log('Claimed all clients');
      })
    ])
  );
});

self.addEventListener('message', (event) => {
  console.log('Service worker received message:', event.data);
  if (event.data.type === 'SKIP_WAITING') {
    console.log('Skip waiting message received');
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only handle Pokemon TCG API requests
  if (url.hostname === 'api.pokemontcg.io') {
    console.log('Handling Pokemon TCG API request:', url.pathname);
    event.respondWith(handleApiRequest(event.request));
  } else {
    console.log('Passing through request:', url.pathname);
    event.respondWith(fetch(event.request));
  }
});

async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  const url = new URL(request.url);

  // Try to get from cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    console.log('Found in cache:', url.pathname);
    return cachedResponse;
  }

  // If not in cache, get from network
  console.log('Fetching from network:', url.pathname);
  try {
    const networkResponse = await fetch(request.clone());
    
    if (networkResponse.ok) {
      console.log('Caching response:', url.pathname);
      // Clone the response before caching it
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
} 