import { useState, useCallback } from 'react';
import { logger } from '../../utils/logger';
import type { Scene } from '../../types/episode';

interface UseSceneDragOptions {
  scene: Scene;
  index: number;
  onMove?: (dragIndex: number, hoverIndex: number) => void;
}

export function useSceneDrag({ scene, index, onMove }: UseSceneDragOptions) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    setIsDragging(true);
    e.currentTarget.classList.add('opacity-50');

    const dragData = {
      type: 'scene',
      id: scene.id,
      actId: scene.actId,
      index,
      scene
    };

    try {
      e.dataTransfer.setData('application/json', JSON.stringify(dragData));
      logger.debug('Scene drag started:', dragData);
    } catch (error) {
      logger.error('Failed to start scene drag:', error);
    }
  }, [scene, index]);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setIsDragging(false);
    e.currentTarget.classList.remove('opacity-50');
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (!onMove) return;

    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const targetIndex = parseInt(target.dataset.index || '0', 10);

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type === 'scene' && data.id !== scene.id) {
        onMove(data.index, targetIndex);
      }
    } catch (error) {
      logger.error('Failed to process drag over:', error);
    }
  }, [scene.id, onMove]);

  return {
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDragOver
  };
}