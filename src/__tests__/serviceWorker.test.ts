import { registerServiceWorker } from '../lib/serviceWorker';

describe('Service Worker Registration', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should register service worker in development environment', async () => {
    // Mock process.env.NODE_ENV
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    await registerServiceWorker();

    expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js', {
      scope: '/',
    });

    // Restore original environment
    process.env.NODE_ENV = originalEnv;
  });

  it('should register service worker in production environment', async () => {
    // Mock process.env.NODE_ENV
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    await registerServiceWorker();

    expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/pokemon-card-tracker/sw.js', {
      scope: '/pokemon-card-tracker/',
    });

    // Restore original environment
    process.env.NODE_ENV = originalEnv;
  });

  it('should unregister existing service workers before registering new one', async () => {
    const mockRegistration = {
      unregister: jest.fn().mockResolvedValue(undefined),
      scope: 'test-scope',
    };

    // Mock existing registration
    navigator.serviceWorker.getRegistrations.mockResolvedValueOnce([mockRegistration]);

    await registerServiceWorker();

    expect(navigator.serviceWorker.getRegistrations).toHaveBeenCalled();
    expect(mockRegistration.unregister).toHaveBeenCalled();
    expect(navigator.serviceWorker.register).toHaveBeenCalled();
  });

  it('should handle waiting service worker', async () => {
    const mockRegistration = {
      waiting: {
        postMessage: jest.fn(),
      },
      addEventListener: jest.fn(),
    };

    navigator.serviceWorker.register.mockResolvedValueOnce(mockRegistration);

    await registerServiceWorker();

    expect(mockRegistration.waiting.postMessage).toHaveBeenCalledWith({
      type: 'SKIP_WAITING',
    });
  });

  it('should handle service worker updates', async () => {
    const mockRegistration = {
      installing: {
        state: 'installed',
        addEventListener: jest.fn(),
      },
      addEventListener: jest.fn(),
    };

    navigator.serviceWorker.register.mockResolvedValueOnce(mockRegistration);
    navigator.serviceWorker.controller = {} as ServiceWorker;

    await registerServiceWorker();

    expect(mockRegistration.addEventListener).toHaveBeenCalledWith(
      'updatefound',
      expect.any(Function)
    );
  });

  it('should return null if service worker is not supported', async () => {
    // Remove service worker support
    delete (window.navigator as any).serviceWorker;

    const result = await registerServiceWorker();

    expect(result).toBeNull();
  });
}); 