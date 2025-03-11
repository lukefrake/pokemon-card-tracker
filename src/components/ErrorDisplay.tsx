'use client';

import { useCollectionStore } from '../store/collectionStore';

export function ErrorDisplay() {
  const error = useCollectionStore((state) => state.error);
  const setError = useCollectionStore((state) => state.setError);

  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-[300px]">
      <p>{error}</p>
      <button
        onClick={() => setError(null)}
        className="absolute top-2 right-2 text-white hover:text-red-200"
      >
        ✕
      </button>
    </div>
  );
} 