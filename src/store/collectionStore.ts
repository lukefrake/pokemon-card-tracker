'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getUserCollection, saveUserCollection, onAuthStateChange } from '../lib/firebaseClient';
import { User } from 'firebase/auth';

interface CollectionState {
  user: User | null;
  collection: Record<string, boolean>;
  hydrated: boolean;
  error: string | null;
  setHydrated: () => void;
  setUser: (user: User | null) => void;
  addCard: (cardId: string) => void;
  removeCard: (cardId: string) => void;
  hasCard: (cardId: string) => boolean;
  setError: (error: string | null) => void;
  syncWithFirebase: () => Promise<void>;
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      user: null,
      collection: {},
      hydrated: false,
      error: null,
      setHydrated: () => set({ hydrated: true }),
      setUser: async (user: User | null) => {
        set({ user });
        if (user) {
          try {
            const existingData = await getUserCollection(user.uid);
            if (existingData) {
              console.log('Found existing collection for user:', user.uid);
              set({ collection: existingData.collection });
            } else {
              console.log('No existing collection found for user:', user.uid);
              set({ collection: {} });
            }
            await get().syncWithFirebase();
          } catch (error) {
            console.error('Error loading collection:', error);
            set({ error: 'Failed to load collection' });
          }
        } else {
          set({ collection: {} });
        }
      },
      addCard: async (cardId: string) => {
        set((state) => ({
          collection: { ...state.collection, [cardId]: true }
        }));
        await get().syncWithFirebase();
      },
      removeCard: async (cardId: string) => {
        set((state) => {
          const newCollection = { ...state.collection };
          delete newCollection[cardId];
          return { collection: newCollection };
        });
        await get().syncWithFirebase();
      },
      hasCard: (cardId: string) => get().collection[cardId] || false,
      setError: (error: string | null) => set({ error }),
      syncWithFirebase: async () => {
        const { user, collection } = get();
        if (!user) {
          console.log('No user logged in, skipping sync');
          return;
        }

        try {
          console.log('Starting Firebase sync for user:', user.uid);
          console.log('Collection to sync:', collection);
          
          await saveUserCollection(user.uid, {
            collection,
            lastUpdated: Date.now(),
          });
          
          // Verify the save by reading back the data
          const savedData = await getUserCollection(user.uid);
          console.log('Verified saved data:', savedData);
          
          if (!savedData) {
            throw new Error('Failed to verify saved data');
          }
          
          set({ error: null }); // Clear any previous errors on successful sync
          console.log('Firebase sync completed successfully');
        } catch (error) {
          console.error('Error syncing with Firebase:', error);
          set({ error: 'Failed to save your collection. Please try again.' });
          throw error;
        }
      },
    }),
    {
      name: 'pokemon-collection',
      partialize: (state) => ({
        collection: state.collection,
      }),
      onRehydrateStorage: () => async (state) => {
        if (!state) return;

        try {
          console.log('Rehydrating storage with state:', state);
          // Set up auth state listener
          const unsubscribe = onAuthStateChange((user) => {
            console.log('Auth state changed:', user?.uid);
            state.setUser(user);
          });

          // Clean up listener when store is destroyed
          return () => unsubscribe();
        } catch (error) {
          console.error('Error initializing store:', error);
          state.setError('Failed to initialize. Please refresh the page.');
        }

        state.setHydrated();
      },
    }
  )
); 