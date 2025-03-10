import { Card, Set } from 'pokemon-tcg-sdk-typescript/dist/sdk';

// Register service worker
const registerServiceWorker = async () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const basePath = process.env.NODE_ENV === 'production' ? '/pokemon-card-tracker' : '';
      const registration = await navigator.serviceWorker.register(`${basePath}/sw.js`, {
        scope: basePath || '/',
      });
      
      if (registration.active) {
        console.log('Service worker active');
      }
      
      registration.addEventListener('activate', () => {
        console.log('Service worker activated');
      });
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
    }
  }
};

// Initialize service worker
if (typeof window !== 'undefined') {
  window.addEventListener('load', registerServiceWorker);
}

// Configure the SDK
const API = {
  async getCards(setId: string): Promise<Card[]> {
    const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${setId}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
      mode: 'cors',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  },

  async getSets(): Promise<Set[]> {
    const response = await fetch('https://api.pokemontcg.io/v2/sets', {
      method: 'GET',
      headers: {
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
      mode: 'cors',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  }
};

export { API as PokemonTCG };
export type { Card, Set }; 