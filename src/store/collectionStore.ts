import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Collection {
  [cardId: string]: boolean;
}

interface Collections {
  [profileName: string]: Collection;
}

interface CollectionState {
  currentProfile: string | null;
  collections: Collections;
  profiles: string[];
  addProfile: (name: string) => boolean;
  removeProfile: (name: string) => void;
  setProfile: (profile: string) => void;
  addCard: (cardId: string) => void;
  removeCard: (cardId: string) => void;
  toggleCard: (cardId: string) => void;
  hasCard: (cardId: string) => boolean;
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      currentProfile: null,
      collections: {},
      profiles: [],
      addProfile: (name) => {
        const state = get();
        // Check if we've hit the profile limit
        if (state.profiles.length >= 5) {
          return false;
        }
        // Check if profile already exists
        if (state.profiles.includes(name)) {
          return false;
        }
        set((state) => ({
          profiles: [...state.profiles, name],
          collections: {
            ...state.collections,
            [name]: {},
          },
          currentProfile: state.currentProfile || name,
        }));
        return true;
      },
      removeProfile: (name) => {
        set((state) => {
          const newProfiles = state.profiles.filter((p) => p !== name);
          const { [name]: removed, ...newCollections } = state.collections;
          return {
            profiles: newProfiles,
            collections: newCollections,
            currentProfile: state.currentProfile === name 
              ? (newProfiles.length > 0 ? newProfiles[0] : null)
              : state.currentProfile,
          };
        });
      },
      setProfile: (profile) =>
        set(() => ({
          currentProfile: profile,
        })),
      addCard: (cardId) =>
        set((state) => {
          if (!state.currentProfile) return state;
          return {
            collections: {
              ...state.collections,
              [state.currentProfile]: {
                ...state.collections[state.currentProfile],
                [cardId]: true,
              },
            },
          };
        }),
      removeCard: (cardId) =>
        set((state) => {
          if (!state.currentProfile) return state;
          return {
            collections: {
              ...state.collections,
              [state.currentProfile]: {
                ...state.collections[state.currentProfile],
                [cardId]: false,
              },
            },
          };
        }),
      toggleCard: (cardId) =>
        set((state) => {
          if (!state.currentProfile) return state;
          return {
            collections: {
              ...state.collections,
              [state.currentProfile]: {
                ...state.collections[state.currentProfile],
                [cardId]: !state.collections[state.currentProfile]?.[cardId],
              },
            },
          };
        }),
      hasCard: (cardId) => {
        const state = get();
        if (!state.currentProfile) return false;
        return state.collections[state.currentProfile]?.[cardId] || false;
      },
    }),
    {
      name: 'pokemon-collection',
    }
  )
); 