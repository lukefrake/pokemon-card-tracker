'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from 'firebase/auth';
import { initializeAuth, getUserCollection, saveUserCollection, onAuthChange } from '../lib/firebase';

interface CollectionState {
  profileName: string | null;
  collection: Record<string, boolean>;
  hydrated: boolean;
  user: User | null;
  error: string | null;
  setHydrated: () => void;
  setProfileName: (name: string) => void;
  addCard: (cardId: string) => void;
  removeCard: (cardId: string) => void;
  hasCard: (cardId: string) => boolean;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  syncWithFirebase: () => Promise<void>;
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      profileName: null,
      collection: {},
      hydrated: false,
      user: null,
      error: null,
      setHydrated: () => set({ hydrated: true }),
      setUser: (user) => set({ user }),
      setError: (error) => set({ error }),
      setProfileName: async (name) => {
        set({ profileName: name });
        await get().syncWithFirebase();
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
      syncWithFirebase: async () => {
        const { user, profileName, collection } = get();
        if (!user) return;

        try {
          await saveUserCollection(user.uid, {
            profileName,
            collection,
            lastUpdated: Date.now(),
          });
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
          // Initialize anonymous auth
          const user = await initializeAuth();
          state.setUser(user);
          
          // Get collection from Firebase
          const firebaseData = await getUserCollection(user.uid);
          if (firebaseData) {
            if (firebaseData.profileName) {
              state.setProfileName(firebaseData.profileName);
            }
            useCollectionStore.setState({ collection: firebaseData.collection });
          }
          
          // Set up auth state listener
          onAuthChange((user) => {
            state.setUser(user);
            if (user) {
              getUserCollection(user.uid).then((data) => {
                if (data) {
                  if (data.profileName) {
                    state.setProfileName(data.profileName);
                  }
                  useCollectionStore.setState({ collection: data.collection });
                }
              });
            }
          });
        } catch (error) {
          console.error('Error initializing store:', error);
          state.setError('Failed to initialize. Please refresh the page.');
        }

        state.setHydrated();
      },
    }
  )
); 