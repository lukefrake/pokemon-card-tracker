import type { Card } from '../lib/pokemon-tcg';
import { useCollectionStore } from '../store/collectionStore';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface CardItemProps {
  card: Card;
}

export const CardItem = ({ card }: CardItemProps) => {
  const { toggleCard, hasCard } = useCollectionStore();
  const isCollected = hasCard(card.id);

  return (
    <div 
      className="relative group cursor-pointer"
      onClick={() => toggleCard(card.id)}
    >
      <div className="relative aspect-[2.5/3.5] rounded-lg overflow-hidden">
        <img
          src={card.images.small}
          alt={card.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
        />
        {isCollected && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <CheckCircleIcon className="w-12 h-12 text-green-500" />
          </div>
        )}
      </div>
      <div className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
        {card.name}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {card.set.name} - {card.number}/{card.set.total}
      </div>
    </div>
  );
}; 