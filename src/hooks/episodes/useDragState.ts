import { useState, useCallback } from 'react';
import { logger } from '../../utils/logger';
import type { Scene } from '../../types/episode';

interface DragData {
  type: 'scene';
  id: number;
  actId: string;
  index: number;
  scene: Scene;
}

export function useDragState() {
  const [isDragging, setIsDragging] = useState(false);

  const setDragData = useCallback((e: React.DragEvent, data: DragData) => {
    try {
      e.dataTransfer.setData('application/json', JSON.stringify(data));
      logger.debug('Set drag data:', data);
    } catch (error) {
      logger.error('Failed to set drag data:', error);
    }
  }, []);

  const getDragData = useCallback((e: React.DragEvent): DragData | null => {
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type === 'scene') {
        return data;
      }
    } catch (error) {
      logger.error('Failed to parse drag data:', error);
    }
    return null;
  }, []);

  return {
    isDragging,
    setIsDragging,
    setDragData,
    getDragData
  };
}