import { Card, Set } from 'pokemon-tcg-sdk-typescript/dist/sdk';

// Register service worker
const registerServiceWorker = async () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const basePath = process.env.NODE_ENV === 'production' ? '/pokemon-card-tracker' : '';
      const swPath = `${basePath}/sw.js`;
      console.log('Registering service worker at:', swPath);
      
      const registration = await navigator.serviceWorker.register(swPath, {
        scope: basePath || '/'
      });
      
      if (registration.active) {
        console.log('Service worker active');
      }
      
      registration.addEventListener('activate', () => {
        console.log('Service worker activated');
      });

      // Check if the service worker is controlling the page
      if (navigator.serviceWorker.controller) {
        console.log('Service worker is controlling the page');
      } else {
        console.log('Service worker is not controlling the page');
      }
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
    try {
      console.log('Fetching cards for set:', setId);
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
      console.log(`Fetched ${data.data.length} cards`);
      return data.data;
    } catch (error) {
      console.error('Error fetching cards:', error);
      throw error;
    }
  },

  async getSets(): Promise<Set[]> {
    try {
      console.log('Fetching sets');
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
      console.log(`Fetched ${data.data.length} sets`);
      return data.data;
    } catch (error) {
      console.error('Error fetching sets:', error);
      throw error;
    }
  }
};

export { API as PokemonTCG };
export type { Card, Set }; 