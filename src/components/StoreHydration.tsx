'use client';

import { useEffect } from 'react';
import { useCollectionStore } from '@/store/collectionStore';

export function StoreHydration() {
  const setHydrated = useCollectionStore((state) => state.setHydrated);

  useEffect(() => {
    // Let Zustand's persist middleware handle the hydration
    useCollectionStore.persist.rehydrate();
    // Mark the store as hydrated
    setHydrated();
  }, [setHydrated]);

  return null;
} 