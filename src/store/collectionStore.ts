'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getUserCollection, saveUserCollection } from '../lib/firebase';

interface CollectionState {
  profileName: string | null;
  collection: Record<string, boolean>;
  hydrated: boolean;
  error: string | null;
  setHydrated: () => void;
  setProfileName: (name: string) => void;
  addCard: (cardId: string) => void;
  removeCard: (cardId: string) => void;
  hasCard: (cardId: string) => boolean;
  setError: (error: string | null) => void;
  syncWithFirebase: () => Promise<void>;
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      profileName: null,
      collection: {},
      hydrated: false,
      error: null,
      setHydrated: () => set({ hydrated: true }),
      setProfileName: async (name) => {
        console.log('Setting profile name:', name);
        set({ profileName: name });
        
        // Try to load existing collection for this profile
        try {
          const existingData = await getUserCollection(name);
          if (existingData) {
            console.log('Found existing collection:', existingData);
            set({ collection: existingData.collection });
          } else {
            console.log('No existing collection found, starting fresh');
            set({ collection: {} });
          }
        } catch (error) {
          console.error('Error loading collection:', error);
          set({ error: 'Failed to load collection. Please try again.' });
        }
      },
      addCard: async (cardId) => {
        set((state) => ({
          collection: {
            ...state.collection,
            [cardId]: true,
          },
        }));
        await get().syncWithFirebase();
      },
      removeCard: async (cardId) => {
        set((state) => {
          const { [cardId]: removed, ...rest } = state.collection;
          return {
            collection: rest,
          };
        });
        await get().syncWithFirebase();
      },
      hasCard: (cardId) => get().collection[cardId] || false,
      setError: (error) => set({ error }),
      syncWithFirebase: async () => {
        const { profileName, collection } = get();
        if (!profileName) {
          console.log('No profile name set, skipping sync');
          return;
        }

        try {
          console.log('Syncing collection for profile:', profileName);
          await saveUserCollection(profileName, {
            profileName,
            collection,
            lastUpdated: Date.now(),
          });
          set({ error: null }); // Clear any previous errors on successful sync
        } catch (error) {
          console.error('Error syncing with Firebase:', error);
          set({ error: 'Failed to save your collection. Please try again.' });
        }
      },
    }),
    {
      name: 'pokemon-collection',
      partialize: (state) => ({
        profileName: state.profileName,
        collection: state.collection,
      }),
      onRehydrateStorage: () => async (state) => {
        if (!state) return;

        try {
          if (state.profileName) {
            const firebaseData = await getUserCollection(state.profileName);
            if (firebaseData) {
              useCollectionStore.setState({ collection: firebaseData.collection });
            }
          }
        } catch (error) {
          console.error('Error initializing store:', error);
          state.setError('Failed to initialize. Please refresh the page.');
        }

        state.setHydrated();
      },
    }
  )
); 