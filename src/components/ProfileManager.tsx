import { useState } from 'react';
import { useCollectionStore } from '../store/collectionStore';

export const ProfileManager = () => {
  const [newProfileName, setNewProfileName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { profileName, setProfileName } = useCollectionStore();

  const handleSetProfile = () => {
    if (!newProfileName.trim()) {
      setError('Please enter a name');
      return;
    }
    setProfileName(newProfileName.trim());
    setNewProfileName('');
    setError(null);
  };

  if (!profileName) {
    return (
      <div className="flex flex-col items-center gap-4 p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Welcome to Pokemon Card Tracker
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Enter your name to start tracking your collection
        </p>
        <div className="flex gap-2 w-full max-w-md">
          <input
            type="text"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            placeholder="Enter your name"
            className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
          <button
            onClick={handleSetProfile}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Collecting
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    );
  }

  return null;
}; 