import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CollectionState {
  profileName: string | null;
  collection: Record<string, boolean>;
  setProfileName: (name: string) => void;
  addCard: (cardId: string) => void;
  removeCard: (cardId: string) => void;
  hasCard: (cardId: string) => boolean;
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      profileName: null,
      collection: {},
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
    }
  )
); 