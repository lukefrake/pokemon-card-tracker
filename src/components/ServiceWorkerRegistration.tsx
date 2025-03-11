'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/serviceWorker';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    const register = async () => {
      try {
        await registerServiceWorker();
      } catch (error) {
        console.error('Failed to register service worker:', error);
      }
    };

    register();

    // No need for cleanup as the service worker will handle its own lifecycle
  }, []);

  return null;
} 