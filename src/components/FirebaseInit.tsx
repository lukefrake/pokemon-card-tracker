'use client';

import { useEffect } from 'react';

export function FirebaseInit() {
  useEffect(() => {
    const initFirebase = async () => {
      console.log('[Firebase] Starting initialization...');
      
      try {
        // Dynamic import of firebase configuration
        const { firebaseConfig } = await import('@/lib/firebase');
        
        console.log('[Firebase] Config loaded:', {
          hasApiKey: !!firebaseConfig.apiKey,
          hasProjectId: !!firebaseConfig.projectId,
          env: process.env.NODE_ENV,
          location: window.location.href
        });

        // Add visual debug element
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
          Firebase Status:<br>
          API Key: ${!!firebaseConfig.apiKey ? '✓' : '✗'}<br>
          Project ID: ${!!firebaseConfig.projectId ? '✓' : '✗'}<br>
          ENV: ${process.env.NODE_ENV}
        `;
        document.body.appendChild(debugDiv);
      } catch (error) {
        console.error('[Firebase] Initialization error:', error);
      }
    };

    initFirebase();
  }, []);

  return null;
} 