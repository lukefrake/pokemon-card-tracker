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
          // Always sync after setting profile name to ensure data is saved
          await get().syncWithFirebase();
        } catch (error) {
          console.error('Error loading collection:', error);
          set({ error: 'Failed to load collection. Please try again.' });
        }
      },
      addCard: async (cardId) => {
        console.log('Adding card:', cardId);
        set((state) => ({
          collection: {
            ...state.collection,
            [cardId]: true,
          },
        }));
        await get().syncWithFirebase();
      },
      removeCard: async (cardId) => {
        console.log('Removing card:', cardId);
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
          console.log('Starting Firebase sync for profile:', profileName);
          console.log('Collection to sync:', collection);
          
          await saveUserCollection(profileName, {
            profileName,
            collection,
            lastUpdated: Date.now(),
          });
          
          // Verify the save by reading back the data
          const savedData = await getUserCollection(profileName);
          console.log('Verified saved data:', savedData);
          
          if (!savedData) {
            throw new Error('Failed to verify saved data');
          }
          
          set({ error: null }); // Clear any previous errors on successful sync
          console.log('Firebase sync completed successfully');
        } catch (error) {
          console.error('Error syncing with Firebase:', error);
          set({ error: 'Failed to save your collection. Please try again.' });
          throw error; // Re-throw to ensure errors are properly handled
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
          console.log('Rehydrating storage with state:', state);
          if (state.profileName) {
            console.log('Loading collection for profile:', state.profileName);
            const firebaseData = await getUserCollection(state.profileName);
            if (firebaseData) {
              console.log('Found Firebase data:', firebaseData);
              useCollectionStore.setState({ collection: firebaseData.collection });
            } else {
              console.log('No Firebase data found for profile:', state.profileName);
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