'use client';

import { useState, useEffect } from 'react';
import { useCollectionStore } from '../store/collectionStore';
import { Card } from '../types/card';
import { fetchCards } from '../lib/pokemonApi';

export default function CardGrid() {
  const { user, collection, addCard, removeCard, hasCard } = useCollectionStore();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const data = await fetchCards();
        setCards(data);
      } catch (err) {
        setError('Failed to load cards');
        console.error('Error loading cards:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, []);

  if (!user) {
    return (
      <div className="text-center mt-8">
        <p className="text-gray-600">Please log in to view and manage your card collection.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-8">
        <p className="text-gray-600">Loading cards...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <img
            src={card.images.small}
            alt={card.name}
            className="w-full h-auto mb-2"
          />
          <h3 className="font-semibold text-lg">{card.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{card.set.name}</p>
          <button
            onClick={() => (hasCard(card.id) ? removeCard(card.id) : addCard(card.id))}
            className={`w-full py-1 px-3 rounded ${
              hasCard(card.id)
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {hasCard(card.id) ? 'Remove from Collection' : 'Add to Collection'}
          </button>
        </div>
      ))}
    </div>
  );
} 