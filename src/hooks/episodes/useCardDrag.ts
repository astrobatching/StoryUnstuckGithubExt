import { useState } from 'react';
import { logger } from '../../utils/logger';
import type { Scene } from '../../types/episode';

export function useCardDrag(scene: Scene) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.currentTarget.classList.add('opacity-50');

    const dragData = {
      type: 'scene-card',
      sceneId: scene.id,
      sourceActId: scene.actId,
      title: scene.title,
      content: scene.content
    };

    logger.debug('Starting drag operation', dragData);
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
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