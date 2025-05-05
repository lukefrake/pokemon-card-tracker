import { Card } from '../types/card';
import { Set } from '../types/set';

const API_BASE_URL = 'https://api.pokemontcg.io/v2';

export async function fetchSets(): Promise<Set[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/sets?pageSize=20`);
    if (!response.ok) {
      throw new Error('Failed to fetch sets');
    }
    const data = await response.json();
    return data.data.map((set: any) => ({
      id: set.id,
      name: set.name,
      images: {
        logo: set.images.logo,
        symbol: set.images.symbol,
      },
      total: set.total,
    }));
  } catch (error) {
    console.error('Error fetching sets:', error);
    throw error;
  }
}

export async function fetchCardsBySet(setId: string): Promise<Card[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/cards?q=set.id:${setId}&pageSize=20`);
    if (!response.ok) {
      throw new Error('Failed to fetch cards');
    }
    const data = await response.json();
    return data.data.map((card: any) => ({
      id: card.id,
      name: card.name,
      images: {
        small: card.images.small,
        large: card.images.large,
      },
      set: {
        name: card.set.name,
      },
    }));
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
}

export async function fetchCards(): Promise<Card[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/cards?pageSize=20`);
    if (!response.ok) {
      throw new Error('Failed to fetch cards');
    }
    const data = await response.json();
    return data.data.map((card: any) => ({
      id: card.id,
      name: card.name,
      images: {
        small: card.images.small,
        large: card.images.large,
      },
      set: {
        name: card.set.name,
      },
    }));
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
} 