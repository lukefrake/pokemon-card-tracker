import { useCollectionStore } from '../store/collectionStore';

describe('Collection Store', () => {
  beforeEach(() => {
    // Clear the store before each test
    useCollectionStore.setState({
      profileName: null,
      collection: {},
      hydrated: false,
    });
  });

  it('should initialize with default values', () => {
    const state = useCollectionStore.getState();
    expect(state.profileName).toBeNull();
    expect(state.collection).toEqual({});
    expect(state.hydrated).toBe(false);
  });

  it('should set profile name', () => {
    const testName = 'Test User';
    useCollectionStore.getState().setProfileName(testName);
    expect(useCollectionStore.getState().profileName).toBe(testName);
  });

  it('should add card to collection', () => {
    const cardId = 'test-card-123';
    useCollectionStore.getState().addCard(cardId);
    expect(useCollectionStore.getState().collection[cardId]).toBe(true);
  });

  it('should remove card from collection', () => {
    const cardId = 'test-card-123';
    useCollectionStore.getState().addCard(cardId);
    useCollectionStore.getState().removeCard(cardId);
    expect(useCollectionStore.getState().collection[cardId]).toBeUndefined();
  });

  it('should check if card exists in collection', () => {
    const cardId = 'test-card-123';
    useCollectionStore.getState().addCard(cardId);
    expect(useCollectionStore.getState().hasCard(cardId)).toBe(true);
    expect(useCollectionStore.getState().hasCard('non-existent-card')).toBe(false);
  });

  it('should set hydrated state', () => {
    expect(useCollectionStore.getState().hydrated).toBe(false);
    useCollectionStore.getState().setHydrated();
    expect(useCollectionStore.getState().hydrated).toBe(true);
  });

  it('should persist state to localStorage', () => {
    const testName = 'Test User';
    const cardId = 'test-card-123';
    
    useCollectionStore.getState().setProfileName(testName);
    useCollectionStore.getState().addCard(cardId);

    // Check if localStorage was called with the correct data
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'pokemon-collection',
      expect.stringContaining(testName)
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'pokemon-collection',
      expect.stringContaining(cardId)
    );
  });
}); 