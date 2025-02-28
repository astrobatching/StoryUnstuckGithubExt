import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { PlottingCard } from './PlottingCard';

interface PlottingSectionProps {
  title: string;
  color: string;
  guide: string;
  cards: Array<{
    id: string;
    content: string;
    position: number;
  }>;
  onAddCard: () => void;
  onUpdateCard: (id: string, content: string) => void;
  onDeleteCard: (id: string) => void;
  onDragStart: (card: any) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (position: number) => void;
}

export const PlottingSection: React.FC<PlottingSectionProps> = ({
  title,
  color,
  guide,
  cards,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  return (
    <div className="border-4 border-black">
      <div className={`${color} p-4 border-b-4 border-black`}>
        <div className="flex justify-between items-center text-white">
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-sm opacity-90">{guide}</p>
          </div>
          <Button variant="ghost" onClick={onAddCard}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div 
        className="grid grid-cols-5 gap-2 p-2"
        onDragOver={onDragOver}
        onDrop={(e) => {
          e.preventDefault();
          onDrop(cards.length);
        }}
      >
        {cards.map((card, index) => (
          <PlottingCard
            key={card.id}
            {...card}
            onUpdate={onUpdateCard}
            onDelete={onDeleteCard}
            onDragStart={() => onDragStart(card)}
          />
        ))}
      </div>
    </div>
  );
};