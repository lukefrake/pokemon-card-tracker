'use client';

import { useEffect, useRef, useState } from 'react';
import type { Set } from '../lib/pokemon-tcg';
import { PokemonTCG } from '../lib/pokemon-tcg';
import { LoadingSpinner } from './LoadingSpinner';

interface SetListProps {
  onSetSelect: (set: Set) => void;
}

export function SetList({ onSetSelect }: SetListProps) {
  const [sets, setSets] = useState<Set[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadSets = async () => {
    try {
      setError(null);
      const fetchedSets = await PokemonTCG.getSets(page);
      setSets(prevSets => [...prevSets, ...fetchedSets]);
      setHasMore(fetchedSets.length > 0);
    } catch (err) {
      setError('Failed to load sets. Please try again later.');
      console.error('Error loading sets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Disconnect previous observer
    if (observer.current) {
      observer.current.disconnect();
    }

    // Create new observer
    observer.current = new IntersectionObserver(entries => {
      const first = entries[0];
      if (first.isIntersecting && hasMore && !loading) {
        setPage(prev => prev + 1);
      }
    }, {
      rootMargin: '100px', // Start loading before the user reaches the bottom
    });

    // Observe loading element
    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, loading]);

  // Load initial sets
  useEffect(() => {
    loadSets();
  }, [page]);

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {sets.map((set) => (
        <div
          key={set.id}
          className="cursor-pointer group"
          onClick={() => onSetSelect(set)}
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
      <div ref={loadingRef} className="col-span-full flex justify-center p-4">
        {loading && <LoadingSpinner />}
      </div>
    </div>
  );
} 