'use client';

// Register service worker
export async function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    // Get the correct path for GitHub Pages
    const basePath = process.env.NODE_ENV === 'production' ? '/pokemon-card-tracker' : '';
    const swPath = `${basePath}/sw.js`;
    
    console.log('Registering service worker with:', {
      swPath,
      scope: basePath || '/',
      location: window.location.href
    });

    // First, unregister any existing service workers
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(registration => {
      console.log('Unregistering service worker:', registration.scope);
      return registration.unregister();
    }));

    // Register new service worker
    const registration = await navigator.serviceWorker.register(swPath, {
      scope: basePath || '/',
    });

    console.log('Service worker registered with scope:', registration.scope);

    // Handle waiting service worker
    if (registration.waiting) {
      console.log('Found waiting service worker, skipping waiting');
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      console.log('New service worker installing');
      newWorker.addEventListener('statechange', () => {
        console.log('Service worker state:', newWorker.state);
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          console.log('New service worker installed and ready');
          newWorker.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    });

    // Handle controller changes
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        console.log('Service worker took control, reloading page');
        refreshing = true;
        window.location.reload();
      }
    });

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
} 