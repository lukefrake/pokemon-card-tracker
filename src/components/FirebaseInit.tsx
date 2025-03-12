'use client';

import { useEffect } from 'react';
import { initializeFirebase } from '../lib/firebaseClient';

console.log('[Firebase] FirebaseInit component loaded');

export function FirebaseInit() {
  console.log('[Firebase] FirebaseInit component rendered');

  useEffect(() => {
    console.log('[Firebase] FirebaseInit useEffect triggered');

    // Create debug element immediately
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
    debugDiv.innerHTML = `Firebase: Initializing...<br>Time: ${new Date().toISOString()}<br>ENV: ${process.env.NODE_ENV}`;
    document.body.appendChild(debugDiv);

    try {
      const { db } = initializeFirebase();
      console.log('[Firebase] Initialization successful:', {
        hasDb: !!db,
        env: process.env.NODE_ENV,
        window: {
          location: window.location.href,
          hostname: window.location.hostname
        }
      });

      debugDiv.style.background = 'rgba(0,0,0,0.8)';
      debugDiv.innerHTML = `
        Firebase: Connected<br>
        Time: ${new Date().toISOString()}<br>
        ENV: ${process.env.NODE_ENV}<br>
        Path: ${window.location.pathname}
      `;
    } catch (error) {
      console.error('[Firebase] Connection error:', error);
      
      debugDiv.style.background = 'rgba(255,0,0,0.8)';
      debugDiv.innerHTML = `
        Firebase: Error<br>
        Time: ${new Date().toISOString()}<br>
        ENV: ${process.env.NODE_ENV}<br>
        Error: ${error instanceof Error ? error.message : 'Unknown error'}<br>
        Stack: ${error instanceof Error ? error.stack : 'No stack trace'}
      `;
    }

    // Cleanup function
    return () => {
      const existingDebug = document.querySelector('div[data-firebase-debug]');
      if (existingDebug) {
        existingDebug.remove();
      }
    };
  }, []);

  return null;
} 