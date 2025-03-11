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

// Create a function that returns the storage implementation
const createStorage = () => {
  // Only import and use IndexedDB on the client side
  if (typeof window === 'undefined') {
    return {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    };
  }

  // Dynamically import idb-keyval only on the client side
  const getIdbKeyval = async () => {
    return import('idb-keyval').then(module => ({
      get: module.get,
      set: module.set,
      del: module.del
    }));
  };

  return {
    getItem: async (name: string): Promise<string | null> => {
      try {
        // Try localStorage first
        const localData = localStorage.getItem(name);
        if (localData) {
          console.log('Found data in localStorage');
          return localData;
        }

        // Fall back to IndexedDB
        console.log('Checking IndexedDB...');
        const idb = await getIdbKeyval();
        const idbData = await idb.get(name);
        if (idbData) {
          console.log('Found data in IndexedDB');
          // If found in IndexedDB, also set in localStorage for faster access next time
          try {
            localStorage.setItem(name, idbData);
          } catch (e) {
            console.warn('Could not save to localStorage:', e);
          }
          return idbData;
        }
        return null;
      } catch (error) {
        console.error('Storage error:', error);
        return null;
      }
    },

    setItem: async (name: string, value: string): Promise<void> => {
      let savedToLocalStorage = false;
      try {
        // Try localStorage first
        localStorage.setItem(name, value);
        savedToLocalStorage = true;
        console.log('Saved to localStorage');
      } catch (error) {
        console.warn('localStorage failed:', error);
      }

      try {
        // Try IndexedDB as backup
        const idb = await getIdbKeyval();
        await idb.set(name, value);
        console.log('Saved to IndexedDB');
      } catch (error) {
        console.error('IndexedDB save failed:', error);
        if (!savedToLocalStorage) {
          console.warn('Could not save to any storage mechanism');
        }
      }
    },

    removeItem: async (name: string): Promise<void> => {
      try {
        localStorage.removeItem(name);
        const idb = await getIdbKeyval();
        await idb.del(name);
        console.log('Removed from storage');
      } catch (error) {
        console.error('Storage error:', error);
      }
    },
  };
};

// Create the store
export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      profileName: null,
      collection: {},
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      setProfileName: (name) => set({ profileName: name }),
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
      storage: createJSONStorage(createStorage),
      partialize: (state) => ({
        profileName: state.profileName,
        collection: state.collection,
      }),
      onRehydrateStorage: () => (state) => {
        useCollectionStore.getState().setHydrated();
      },
    }
  )
); 