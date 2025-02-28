import { useState } from 'react';
import type { Scene } from '../../types/episode';

export function useDragScene(scene: Scene) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.currentTarget.classList.add('opacity-50');

    const dragData = {
      type: 'scene',
      id: scene.id,
      episodeId: scene.episodeId,
      actId: scene.actId,
      title: scene.title,
      content: scene.content
    };

    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return {
    isDragging,
    handleDragStart,
    handleDragEnd
  };
}