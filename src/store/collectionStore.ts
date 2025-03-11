'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval';

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

// Custom storage that tries localStorage first, then falls back to IndexedDB
const customStorage = {
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
      const idbData = await idbGet(name);
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
      // Always save to IndexedDB as backup
      await idbSet(name, value);
      console.log('Saved to IndexedDB');
    } catch (error) {
      console.error('IndexedDB save failed:', error);
      if (!savedToLocalStorage) {
        throw error; // Only throw if we couldn't save anywhere
      }
    }
  },

  removeItem: async (name: string): Promise<void> => {
    try {
      localStorage.removeItem(name);
      await idbDel(name);
      console.log('Removed from both storages');
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
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
      storage: createJSONStorage(() => customStorage),
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

// Initialize the store immediately when the module loads
if (typeof window !== 'undefined') {
  console.log('Initializing store...');
  const loadInitialState = async () => {
    try {
      const data = await customStorage.getItem('pokemon-collection');
      if (data) {
        const parsedData = JSON.parse(data);
        console.log('Found initial state:', parsedData);
        useCollectionStore.setState(parsedData);
      } else {
        console.log('No initial state found');
      }
    } catch (error) {
      console.error('Error loading initial state:', error);
    } finally {
      useCollectionStore.getState().setHydrated();
    }
  };

  // Ensure we wait for the DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadInitialState();
    });
  } else {
    loadInitialState();
  }
} 