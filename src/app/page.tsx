'use client';

import { useState } from 'react';
import type { Set, Card } from '../lib/pokemon-tcg';
import { PokemonTCG } from '../lib/pokemon-tcg';
import { SetList } from '../components/SetList';
import { CardItem } from '../components/CardItem';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ProfileManager } from '../components/ProfileManager';
import { ServiceWorkerStatus } from '../components/ServiceWorkerStatus';
import { useCollectionStore } from '../store/collectionStore';

export default function Home() {
  const [selectedSet, setSelectedSet] = useState<Set | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const currentProfile = useCollectionStore((state) => state.currentProfile);

  const handleSetSelect = async (set: Set) => {
    setLoading(true);
    setSelectedSet(set);
    try {
      const fetchedCards = await PokemonTCG.getCards(set.id);
      setCards(fetchedCards);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">
        Pokemon Card Tracker
      </h1>

      <div className="mb-8">
        <ProfileManager />
      </div>
      
      {currentProfile ? (
        !selectedSet ? (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {currentProfile}&apos;s Sets
            </h2>
            <SetList onSetSelect={handleSetSelect} />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {currentProfile}&apos;s {selectedSet.name} Cards
              </h2>
              <button
                onClick={() => {
                  setSelectedSet(null);
                  setCards([]);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Back to Sets
              </button>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center h-[60vh]">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {cards.map((card) => (
                  <CardItem key={card.id} card={card} />
                ))}
              </div>
            )}
          </>
        )
      ) : null}
      <ServiceWorkerStatus />
    </main>
  );
}
