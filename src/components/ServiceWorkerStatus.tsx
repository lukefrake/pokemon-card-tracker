import { useEffect, useState } from 'react';

export const ServiceWorkerStatus = () => {
  const [status, setStatus] = useState<string>('Checking...');

  useEffect(() => {
    const checkServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          if (registration.active) {
            setStatus('Active');
          } else {
            setStatus('Registered but not active');
          }
        } catch (error) {
          setStatus('Not working');
          console.error('Service Worker status check failed:', error);
        }
      } else {
        setStatus('Not supported');
      }
    };

    checkServiceWorker();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg text-sm text-gray-800 dark:text-gray-200">
      Service Worker: {status}
    </div>
  );
}; 