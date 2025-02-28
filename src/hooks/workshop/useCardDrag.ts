import { useState } from 'react';

export function useCardDrag() {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.currentTarget.classList.add('opacity-50');

    // Set drag data
    const data = {
      type: 'story-card',
      id: e.currentTarget.id,
      source: 'workshop'
    };
    e.dataTransfer.setData('application/json', JSON.stringify(data));
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    e.currentTarget.classList.remove('opacity-50');
  };

  return {
    isDragging,
    handleDragStart,
    handleDragEnd
  };
}