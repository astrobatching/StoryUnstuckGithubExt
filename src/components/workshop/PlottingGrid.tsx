import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { PlottingSection } from './PlottingSection';

interface PlotCard {
  id: string;
  content: string;
  sectionId: string;
  position: number;
}

const defaultSections = [
  { id: 'setup', title: 'Setup', color: 'bg-blue-500', guide: 'Establish the world and characters' },
  { id: 'conflict', title: 'Conflict', color: 'bg-red-500', guide: 'Introduce the main conflict' },
  { id: 'rising', title: 'Rising Action', color: 'bg-yellow-500', guide: 'Escalate the stakes' },
  { id: 'climax', title: 'Climax', color: 'bg-purple-500', guide: 'The highest point of tension' },
  { id: 'falling', title: 'Falling Action', color: 'bg-green-500', guide: 'Show the aftermath' },
  { id: 'resolution', title: 'Resolution', color: 'bg-gray-500', guide: 'Wrap up loose ends' }
];

export const PlottingGrid: React.FC = () => {
  const [plotCards, setPlotCards] = useState<PlotCard[]>([]);
  const [draggedCard, setDraggedCard] = useState<PlotCard | null>(null);

  const handleAddCard = (sectionId: string) => {
    const newCard: PlotCard = {
      id: Date.now().toString(),
      content: 'New plot point...',
      sectionId,
      position: plotCards.filter(card => card.sectionId === sectionId).length
    };
    setPlotCards([...plotCards, newCard]);
  };

  const handleUpdateCard = (cardId: string, content: string) => {
    setPlotCards(
      plotCards.map(card => 
        card.id === cardId ? { ...card, content } : card
      )
    );
  };

  const handleDeleteCard = (cardId: string) => {
    setPlotCards(plotCards.filter(card => card.id !== cardId));
  };

  const handleDragStart = (card: PlotCard) => {
    setDraggedCard(card);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetSectionId: string, targetPosition: number) => {
    if (!draggedCard) return;

    const updatedCards = plotCards.filter(card => card.id !== draggedCard.id);
    const newCard = { ...draggedCard, sectionId: targetSectionId, position: targetPosition };
    
    setPlotCards([...updatedCards, newCard].sort((a, b) => a.position - b.position));
    setDraggedCard(null);
  };

  return (
    <div className="border-4 border-black bg-white p-4">
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="col-span-4 font-bold text-lg">Story Quadrants</div>
        {['Q1', 'Q2', 'Q3', 'Q4'].map((quadrant) => (
          <div key={quadrant} className="border-2 border-black p-2 text-center">
            {quadrant}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {defaultSections.map((section) => (
          <PlottingSection
            key={section.id}
            title={section.title}
            color={section.color}
            guide={section.guide}
            cards={plotCards.filter(card => card.sectionId === section.id)}
            onAddCard={() => handleAddCard(section.id)}
            onUpdateCard={handleUpdateCard}
            onDeleteCard={handleDeleteCard}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={(position) => handleDrop(section.id, position)}
          />
        ))}
      </div>
    </div>
  );
};