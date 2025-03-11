// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

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

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock }); 