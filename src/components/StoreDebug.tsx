'use client';

import { useCollectionStore } from '../store/collectionStore';

export function StoreDebug() {
  const store = useCollectionStore();

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm max-w-[300px] overflow-auto">
      <h3 className="font-bold mb-2">Store Debug</h3>
      <div>
        <p>Hydrated: {String(store.hydrated)}</p>
        <p>Profile: {store.profileName || 'none'}</p>
        <p>Cards: {Object.keys(store.collection).length}</p>
      </div>
    </div>
  );
} 