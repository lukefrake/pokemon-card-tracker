'use client';

import { useEffect } from 'react';

console.log('[Firebase] FirebaseInit component loaded');

export function FirebaseInit() {
  console.log('[Firebase] FirebaseInit component rendered');

  useEffect(() => {
    console.log('[Firebase] FirebaseInit useEffect triggered');

    const initFirebase = async () => {
      console.log('[Firebase] Starting initialization...');
      
      try {
        await import('@/lib/firebase');
        console.log('[Firebase] Initialization complete');

        if (process.env.NODE_ENV === 'development') {
          // Add visual debug element only in development
          const debugDiv = document.createElement('div');
          debugDiv.style.position = 'fixed';
          debugDiv.style.bottom = '10px';
          debugDiv.style.right = '10px';
          debugDiv.style.padding = '10px';
          debugDiv.style.background = 'rgba(0,0,0,0.8)';
          debugDiv.style.color = 'white';
          debugDiv.style.borderRadius = '5px';
          debugDiv.style.fontSize = '12px';
          debugDiv.style.fontFamily = 'monospace';
          debugDiv.style.zIndex = '9999';
          debugDiv.innerHTML = `
            Firebase Status: Connected<br>
            Environment: ${process.env.NODE_ENV}
          `;
          document.body.appendChild(debugDiv);
        }
      } catch (error) {
        console.error('[Firebase] Connection error');
        
        if (process.env.NODE_ENV === 'development') {
          // Add error debug element only in development
          const errorDiv = document.createElement('div');
          errorDiv.style.position = 'fixed';
          errorDiv.style.bottom = '10px';
          errorDiv.style.right = '10px';
          errorDiv.style.padding = '10px';
          errorDiv.style.background = 'rgba(255,0,0,0.8)';
          errorDiv.style.color = 'white';
          errorDiv.style.borderRadius = '5px';
          errorDiv.style.fontSize = '12px';
          errorDiv.style.fontFamily = 'monospace';
          errorDiv.style.zIndex = '9999';
          errorDiv.innerHTML = 'Firebase Error: Connection failed';
          document.body.appendChild(errorDiv);
        }
      }
    };

    initFirebase();
  }, []);

  return null;
} 