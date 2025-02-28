import { useState, useCallback } from 'react';
import { logger } from '../../utils/logger';
import type { DragPayload, DragMetadata } from '../../types/dragTypes';
import type { CardState } from '../../types/card';

interface DragStateHook {
  isDragging: boolean;
  dragData: DragPayload | null;
  handleDragStart: (e: React.DragEvent, card: CardState, metadata: DragMetadata) => void;
  handleDragEnd: (e: React.DragEvent) => void;
  getDragData: (e: React.DragEvent) => DragPayload | null;
}

export function useDragState(): DragStateHook {
  const [isDragging, setIsDragging] = useState(false);
  const [dragData, setDragData] = useState<DragPayload | null>(null);

  const handleDragStart = useCallback((
    e: React.DragEvent, 
    card: CardState, 
    metadata: DragMetadata
  ) => {
    try {
      const payload: DragPayload = {
        type: 'card',
        data: {
          ...card,
          metadata
        }
      };

      e.dataTransfer.setData('application/json', JSON.stringify(payload));
      setDragData(payload);
      setIsDragging(true);

      logger.debug('Drag started:', { card, metadata });
    } catch (error) {
      logger.error('Failed to start drag:', error);
    }
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setIsDragging(false);
    setDragData(null);
  }, []);

  const getDragData = useCallback((e: React.DragEvent): DragPayload | null => {
    try {
      const data = e.dataTransfer.getData('application/json');
      if (!data) return null;
      
      const payload = JSON.parse(data) as DragPayload;
      if (payload.type !== 'card') return null;

      return payload;
    } catch (error) {
      logger.error('Failed to parse drag data:', error);
      return null;
    }
  }, []);

  return {
    isDragging,
    dragData,
    handleDragStart,
    handleDragEnd,
    getDragData
  };
}