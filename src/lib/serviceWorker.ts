'use client';

// Register service worker
export async function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    // Get the correct path for GitHub Pages
    const basePath = process.env.NODE_ENV === 'production' ? '/pokemon-card-tracker' : '';
    
    // First, unregister any existing service workers
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(registration => registration.unregister()));

    // Register new service worker
    const registration = await navigator.serviceWorker.register(`${basePath}/sw.js`, {
      scope: basePath || '/',
    });

    // Handle waiting service worker
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker is installed and ready to take over
          newWorker.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    });

    // Handle controller changes
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });

    console.log('Service Worker registered successfully:', registration.scope);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
} 