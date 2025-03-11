import { useCollectionStore } from '../store/collectionStore';
import { saveUserCollection } from '../lib/firebase';
import { User } from 'firebase/auth';

jest.mock('../lib/firebase');

const mockUser: Partial<User> = {
  uid: 'test-user-id',
  emailVerified: false,
  isAnonymous: true,
  metadata: {},
  providerData: [],
  refreshToken: '',
  tenantId: null,
  delete: jest.fn(),
  getIdToken: jest.fn(),
  getIdTokenResult: jest.fn(),
  reload: jest.fn(),
  toJSON: jest.fn(),
};

describe('Collection Store', () => {
  beforeEach(() => {
    // Clear the store before each test
    useCollectionStore.setState({
      profileName: null,
      collection: {},
      hydrated: false,
      user: mockUser as User,
      error: null,
    });
    // Clear mocks
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const state = useCollectionStore.getState();
    expect(state.profileName).toBeNull();
    expect(state.collection).toEqual({});
    expect(state.hydrated).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should set profile name and sync with Firebase', async () => {
    const testName = 'Test User';
    await useCollectionStore.getState().setProfileName(testName);
    expect(useCollectionStore.getState().profileName).toBe(testName);
    expect(saveUserCollection).toHaveBeenCalledWith('test-user-id', expect.objectContaining({
      profileName: testName,
      collection: {}
    }));
  });

  it('should add card to collection and sync with Firebase', async () => {
    const cardId = 'test-card-123';
    await useCollectionStore.getState().addCard(cardId);
    expect(useCollectionStore.getState().collection[cardId]).toBe(true);
    expect(saveUserCollection).toHaveBeenCalledWith('test-user-id', expect.objectContaining({
      collection: { [cardId]: true }
    }));
  });

  it('should remove card from collection and sync with Firebase', async () => {
    const cardId = 'test-card-123';
    await useCollectionStore.getState().addCard(cardId);
    await useCollectionStore.getState().removeCard(cardId);
    expect(useCollectionStore.getState().collection[cardId]).toBeUndefined();
    expect(saveUserCollection).toHaveBeenLastCalledWith('test-user-id', expect.objectContaining({
      collection: {}
    }));
  });

  it('should check if card exists in collection', async () => {
    const cardId = 'test-card-123';
    await useCollectionStore.getState().addCard(cardId);
    expect(useCollectionStore.getState().hasCard(cardId)).toBe(true);
    expect(useCollectionStore.getState().hasCard('non-existent-card')).toBe(false);
  });

  it('should set hydrated state', () => {
    expect(useCollectionStore.getState().hydrated).toBe(false);
    useCollectionStore.getState().setHydrated();
    expect(useCollectionStore.getState().hydrated).toBe(true);
  });

  it('should handle Firebase errors', async () => {
    const error = new Error('Firebase error');
    (saveUserCollection as jest.Mock).mockRejectedValueOnce(error);
    
    const cardId = 'test-card-123';
    await useCollectionStore.getState().addCard(cardId);
    
    expect(useCollectionStore.getState().error).toBe('Failed to save your collection. Please try again.');
  });
}); 