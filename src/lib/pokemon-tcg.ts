'use client';

import type { Card, Set } from 'pokemon-tcg-sdk-typescript/dist/sdk';

const SETS_PER_PAGE = 24;

// Create the API interface that matches what the rest of the app expects
export const PokemonTCG = {
  async getSets(page: number = 1): Promise<Set[]> {
    try {
      // Configure API key only on client side
      if (typeof window !== 'undefined') {
        const apiKey = process.env.NEXT_PUBLIC_POKEMON_TCG_API_KEY;
        if (apiKey) {
          (window as any).POKEMON_TCG_API_KEY = apiKey;
        }
      }

      // Import and use the service functions
      const { findSetsByQueries } = await import('pokemon-tcg-sdk-typescript/dist/services/setService');
      
      // Use the API's built-in pagination
      const sets = await findSetsByQueries({
        orderBy: '-releaseDate', // Sort by release date descending
        page: page,
        pageSize: SETS_PER_PAGE
      });
      
      return sets;
    } catch (error) {
      console.error('Error fetching sets:', error);
      return [];
    }
  },

  async getCards(setId: string): Promise<Card[]> {
    try {
      // Configure API key only on client side
      if (typeof window !== 'undefined') {
        const apiKey = process.env.NEXT_PUBLIC_POKEMON_TCG_API_KEY;
        if (apiKey) {
          (window as any).POKEMON_TCG_API_KEY = apiKey;
        }
      }

      // Import and use the service functions
      const { findCardsByQueries } = await import('pokemon-tcg-sdk-typescript/dist/services/cardService');
      const cards = await findCardsByQueries({ q: `set.id:${setId}` });
      return cards;
    } catch (error) {
      console.error('Error fetching cards:', error);
      return [];
    }
  }
};

export type { Card, Set }; 