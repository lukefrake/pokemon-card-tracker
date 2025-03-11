'use client';

import { Card, Set } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import { getAllSets } from 'pokemon-tcg-sdk-typescript/dist/services/setService';
import { findCardsByQueries } from 'pokemon-tcg-sdk-typescript/dist/services/cardService';

// Create the API interface that matches what the rest of the app expects
export const PokemonTCG = {
  async getSets(): Promise<Set[]> {
    try {
      const sets = await getAllSets();
      return sets;
    } catch (error) {
      console.error('Error fetching sets:', error);
      return [];
    }
  },

  async getCards(setId: string): Promise<Card[]> {
    try {
      const cards = await findCardsByQueries({ q: `set.id:${setId}` });
      return cards;
    } catch (error) {
      console.error('Error fetching cards:', error);
      return [];
    }
  }
};

// Configure the API key if provided
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POKEMON_TCG_API_KEY) {
  const { configure } = require('pokemon-tcg-sdk-typescript');
  configure({ apiKey: process.env.NEXT_PUBLIC_POKEMON_TCG_API_KEY });
}

export type { Card, Set }; 