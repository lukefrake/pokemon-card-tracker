'use client';

import { useState } from 'react';
import { useCollectionStore } from '../store/collectionStore';

export function ProfileManager() {
  const { profileName, setProfileName } = useCollectionStore();
  const hydrated = useCollectionStore((state) => state.hydrated);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState('');

  if (!hydrated) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      setProfileName(newName.trim());
      setNewName('');
      setEditMode(false);
    }
  };

  if (!profileName && !editMode) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Pokemon Card Tracker</h1>
        <button
          onClick={() => setEditMode(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Set Profile Name
        </button>
      </div>
    );
  }

  if (editMode) {
    return (
      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter profile name"
            className="border rounded px-2 py-1"
            autoFocus
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              setEditMode(false);
              setNewName('');
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded"
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="flex gap-2 items-center">
        <span className="font-bold">Profile: {profileName}</span>
        <button
          onClick={() => setEditMode(true)}
          className="text-blue-500 hover:text-blue-600 underline text-sm"
        >
          Edit
        </button>
      </div>
    </div>
  );
} 