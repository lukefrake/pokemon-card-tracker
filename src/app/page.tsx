'use client';

import { useState, useEffect } from 'react';
import { useCollectionStore } from '../store/collectionStore';
import { Set } from '../types/set';
import { Card } from '../types/card';
import { PokemonTCG } from '../lib/pokemon-tcg';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function Home() {
  const { user, hasCard, addCard, removeCard } = useCollectionStore();
  const [sets, setSets] = useState<Set[]>([]);
  const [selectedSet, setSelectedSet] = useState<Set | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadSets = async () => {
      try {
        const data = await PokemonTCG.getSets(page);
        if (data.length > 0) {
          // Create a Map of existing sets to prevent duplicates
          const existingSets = new Map(sets.map(set => [set.id, set]));
          
          // Add new sets that don't already exist
          data.forEach(set => {
            if (!existingSets.has(set.id)) {
              existingSets.set(set.id, set);
            }
          });
          
          // Convert Map back to array
          setSets(Array.from(existingSets.values()));
          setHasMore(data.length === 24); // 24 is our SETS_PER_PAGE
        } else {
          setHasMore(false);
        }
      } catch (err) {
        setError('Failed to load card sets');
        console.error('Error loading sets:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSets();
  }, [page]);

  const handleSetSelect = async (set: Set) => {
    setSelectedSet(set);
    setLoading(true);
    try {
      const cards = await PokemonTCG.getCards(set.id);
      setCards(cards);
    } catch (err) {
      setError('Failed to load cards');
      console.error('Error loading cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedSet(null);
    setCards([]);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  if (!user) {
    return (
      <div className="text-center mt-8">
        <p className="text-gray-600">Please log in to view and manage your card collection.</p>
      </div>
    );
  }

  if (loading && sets.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner />
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
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">
        Pokemon Card Tracker
      </h1>

      {!selectedSet ? (
        <>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Available Sets
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {sets.map((set) => (
              <div
                key={set.id}
                className="cursor-pointer group"
                onClick={() => handleSetSelect(set)}
              >
                <div className="relative aspect-[2.5/3.5] rounded-lg overflow-hidden">
                  <img
                    src={set.images.logo}
                    alt={set.name}
                    className="w-full h-full object-contain p-4 transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="mt-2 text-sm font-medium text-center text-gray-900 dark:text-gray-100">
                  {set.name}
                </div>
                <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                  {set.total} cards
                </div>
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More Sets'}
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {selectedSet.name} Cards
            </h2>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Sets
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
        </>
      )}
    </main>
  );
}
