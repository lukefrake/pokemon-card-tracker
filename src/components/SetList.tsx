import { useState, useEffect } from 'react';
import type { Set } from '../lib/pokemon-tcg';
import { PokemonTCG } from '../lib/pokemon-tcg';

export const SetList = ({ onSetSelect }: { onSetSelect: (set: Set) => void }) => {
  const [sets, setSets] = useState<Set[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const fetchedSets = await PokemonTCG.getSets();
        setSets(fetchedSets.sort((a: Set, b: Set) => b.releaseDate.localeCompare(a.releaseDate)));
      } catch (error) {
        console.error('Error fetching sets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-900 dark:text-gray-100">Loading sets...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {sets.map((set) => (
        <div
          key={set.id}
          className="cursor-pointer hover:shadow-lg transition-shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          onClick={() => onSetSelect(set)}
        >
          <div className="aspect-video relative">
            <img
              src={set.images.logo}
              alt={set.name}
              className="absolute inset-0 w-full h-full object-contain p-4"
            />
          </div>
          <div className="p-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{set.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Released: {new Date(set.releaseDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {set.total} cards
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}; 