// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock the Firebase configuration
jest.mock('./src/lib/firebase', () => ({
  initializeAuth: jest.fn().mockResolvedValue({ uid: 'test-user-id' }),
  getUserCollection: jest.fn().mockResolvedValue(null),
  saveUserCollection: jest.fn().mockResolvedValue(undefined),
  onAuthChange: jest.fn().mockReturnValue(() => {}),
}));

// Mock the window.localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock the window.location
delete window.location;
window.location = {
  hash: '',
  pathname: '/',
  search: '',
  href: 'http://localhost/',
  toString: () => 'http://localhost/',
};

// Mock service worker registration
Object.defineProperty(window, 'navigator', {
  value: {
    serviceWorker: {
      register: jest.fn().mockResolvedValue({
        installing: null,
        waiting: null,
        active: { postMessage: jest.fn() },
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        unregister: jest.fn().mockResolvedValue(undefined),
      }),
      getRegistrations: jest.fn().mockResolvedValue([]),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
  },
  configurable: true,
}); 