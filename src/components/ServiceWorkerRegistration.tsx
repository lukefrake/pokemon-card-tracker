'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').catch(function(err) {
          console.error('ServiceWorker registration failed:', err);
        });
      });
    }
  }, []);

  return null;
} 