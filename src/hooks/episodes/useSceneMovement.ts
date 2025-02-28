import { useState, useCallback } from 'react';
import { logger } from '../../utils/logger';
import type { Scene } from '../../types/episode';

interface DragState {
  sourceId: string;
  targetId: string | null;
  position: 'before' | 'after' | null;
}

export function useSceneMovement() {
  const [dragState, setDragState] = useState<DragState>({
    sourceId: '',
    targetId: null,
    position: null
  });

  const handleDragStart = useCallback((e: React.DragEvent, scene: Scene & { index: number }) => {
    try {
      const dragData = {
        type: 'scene',
        id: scene.id,
        actId: scene.actId,
        index: scene.index,
        scene
      };

      e.dataTransfer.setData('application/json', JSON.stringify(dragData));
      logger.debug('Started dragging scene:', dragData);
      
      setDragState(prev => ({
        ...prev,
        sourceId: scene.id.toString()
      }));
    } catch (error) {
      logger.error('Failed to start drag:', error);
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState({
      sourceId: '',
      targetId: null,
      position: null
    });
  }, []);

  const updateDropPosition = useCallback((e: React.DragEvent, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const mouseY = e.clientY;
    const threshold = rect.top + (rect.height * 0.5);
    const position = mouseY < threshold ? 'before' : 'after';

    setDragState(prev => ({
      ...prev,
      targetId: element.id,
      position
    }));

    return position;
  }, []);

  return {
    dragState,
    handleDragStart,
    handleDragEnd,
    updateDropPosition
  };
}