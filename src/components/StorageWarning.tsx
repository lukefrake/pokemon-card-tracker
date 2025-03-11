'use client';

import { useEffect, useState } from 'react';

export function StorageWarning() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const checkStorage = async () => {
      try {
        // Try to write to localStorage
        const testKey = '_storage_test_';
        localStorage.setItem(testKey, 'test');
        const value = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);

        if (value !== 'test') {
          setShowWarning(true);
        }
      } catch (error) {
        setShowWarning(true);
      }
    };

    checkStorage();
  }, []);

  if (!showWarning) return null;

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
      <p className="font-bold">Storage Warning</p>
      <p>
        Your browser may not be saving data properly. To ensure your collection is saved:
        <ul className="list-disc ml-5 mt-2">
          <li>Keep this tab open</li>
          <li>Add this page to your home screen</li>
          <li>Check your browser&apos;s storage settings</li>
        </ul>
      </p>
    </div>
  );
} 