import { useState } from 'react';
import { useCollectionStore } from '../store/collectionStore';

export const ProfileManager = () => {
  const { profiles, currentProfile, addProfile, removeProfile, setProfile } = useCollectionStore();
  const [newProfileName, setNewProfileName] = useState('');
  const [error, setError] = useState('');

  const handleAddProfile = () => {
    const trimmedName = newProfileName.trim();
    if (!trimmedName) {
      setError('Please enter a profile name');
      return;
    }

    const success = addProfile(trimmedName);
    if (success) {
      setNewProfileName('');
      setError('');
    } else {
      if (profiles.length >= 5) {
        setError('Maximum of 5 profiles reached');
      } else {
        setError('Profile name already exists');
      }
    }
  };

  const handleRemoveProfile = (name: string) => {
    if (confirm(`Are you sure you want to delete ${name}'s collection? This cannot be undone.`)) {
      removeProfile(name);
    }
  };

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Welcome to Pokemon Card Tracker
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Create your first profile to start tracking your collection
        </p>
        <div className="flex gap-2 w-full max-w-md">
          <input
            type="text"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            placeholder="Enter profile name"
            className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
          <button
            onClick={handleAddProfile}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Profile
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {profiles.map((profile) => (
          <div
            key={profile}
            className={`group relative px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              currentProfile === profile
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setProfile(profile)}
          >
            {profile}
            {profiles.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveProfile(profile);
                }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {profiles.length < 5 && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            placeholder="New profile name"
            className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
          <button
            onClick={handleAddProfile}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Profile
          </button>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}; 