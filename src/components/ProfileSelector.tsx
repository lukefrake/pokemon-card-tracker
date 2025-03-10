import { useCollectionStore } from '../store/collectionStore';

export const ProfileSelector = () => {
  const { currentProfile, setProfile } = useCollectionStore();

  return (
    <div className="flex items-center gap-4 justify-center mb-8">
      <button
        onClick={() => setProfile('Louie')}
        className={`px-6 py-3 rounded-lg text-lg font-medium transition-colors ${
          currentProfile === 'Louie'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Louie's Collection
      </button>
      <button
        onClick={() => setProfile('Harry')}
        className={`px-6 py-3 rounded-lg text-lg font-medium transition-colors ${
          currentProfile === 'Harry'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Harry's Collection
      </button>
    </div>
  );
}; 