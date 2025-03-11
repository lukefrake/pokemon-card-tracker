// Register service worker
export const registerServiceWorker = async () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const isDevelopment = process.env.NODE_ENV === 'development';
      const basePath = isDevelopment ? '' : '/pokemon-card-tracker';
      const swPath = `${basePath}/sw.js`;
      
      console.log('Environment:', process.env.NODE_ENV);
      console.log('Base path:', basePath);
      console.log('Registering service worker at:', swPath);
      
      // Unregister any existing service workers first
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log('Existing service workers:', registrations.length);
      for (const registration of registrations) {
        console.log('Unregistering service worker:', registration.scope);
        await registration.unregister();
      }
      
      // Register the new service worker
      const registration = await navigator.serviceWorker.register(swPath, {
        scope: isDevelopment ? '/' : basePath,
        updateViaCache: 'none' // Always check for updates
      });
      
      console.log('Service worker registered with scope:', registration.scope);
      
      // Wait for the service worker to be ready
      const ready = await navigator.serviceWorker.ready;
      console.log('Service worker ready:', ready.scope);
      
      // Force activation if needed
      if (registration.waiting) {
        console.log('Service worker waiting, activating immediately');
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      
      if (registration.active) {
        console.log('Service worker active');
        // Force claim
        registration.active.postMessage({ type: 'CLAIM_CLIENTS' });
      }
      
      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            console.log('Service worker state changed to:', newWorker.state);
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('New service worker installed and ready to take over');
                newWorker.postMessage({ type: 'SKIP_WAITING' });
              }
            } else if (newWorker.state === 'activated') {
              console.log('New service worker activated');
              newWorker.postMessage({ type: 'CLAIM_CLIENTS' });
            }
          });
        }
      });

      // Handle controller changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service worker controller changed');
      });

    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
    }
  } else {
    console.log('Service workers not supported or running in SSR');
  }
}; 