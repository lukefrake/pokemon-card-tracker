'use client';

import { useCollectionStore } from '../store/collectionStore';
import type { Card } from '../lib/pokemon-tcg';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface CardItemProps {
  card: Card;
}

export function CardItem({ card }: CardItemProps) {
  const { addCard, removeCard, hasCard } = useCollectionStore();
  const hydrated = useCollectionStore((state) => state.hydrated);

  if (!hydrated) {
    return null;
  }

  const isInCollection = hasCard(card.id);

  const handleCardClick = () => {
    if (isInCollection) {
      removeCard(card.id);
    } else {
      addCard(card.id);
    }
  };

  return (
    <div 
      className="relative group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative aspect-[2.5/3.5] rounded-lg overflow-hidden">
        <img
          src={card.images.small}
          alt={card.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
        />
        {isInCollection && (
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
} 