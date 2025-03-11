'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CollectionState {
  profileName: string | null;
  collection: Record<string, boolean>;
  setProfileName: (name: string) => void;
  addCard: (cardId: string) => void;
  removeCard: (cardId: string) => void;
  hasCard: (cardId: string) => boolean;
  hydrated: boolean;
  setHydrated: () => void;
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      profileName: null,
      collection: {},
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      setProfileName: (name) => 
        set(() => ({
          profileName: name,
        })),
      addCard: (cardId) =>
        set((state) => ({
          collection: {
            ...state.collection,
            [cardId]: true,
          },
        })),
      removeCard: (cardId) =>
        set((state) => {
          const { [cardId]: removed, ...rest } = state.collection;
          return {
            collection: rest,
          };
        }),
      hasCard: (cardId) => get().collection[cardId] || false,
    }),
    {
      name: 'pokemon-collection',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
); 