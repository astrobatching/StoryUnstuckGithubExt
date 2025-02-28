import { useState, useCallback } from 'react';
import { logger } from '../../utils/logger';

interface DragItem {
  id: string | number;
  type: string;
  sourceId: string;
  sourceType: string;
  data: Record<string, any>;
}

export function useDragDrop<T extends DragItem>(options: {
  itemType: string;
  sourceId: string;
  sourceType: string;
  onDrop?: (item: T, targetId: string) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const handleDragStart = useCallback((e: React.DragEvent, item: Omit<T, 'type' | 'sourceId' | 'sourceType'>) => {
    setIsDragging(true);
    e.currentTarget.classList.add('opacity-50');

    const dragData: T = {
      ...item,
      type: options.itemType,
      sourceId: options.sourceId,
      sourceType: options.sourceType,
    } as T;

    logger.debug('Starting drag operation', dragData);
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
  }, [options.itemType, options.sourceId, options.sourceType]);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setIsDragging(false);
    e.currentTarget.classList.remove('opacity-50');
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('application/json')) {
      e.preventDefault();
      setIsDraggedOver(true);
      e.currentTarget.classList.add('bg-gray-100/50', 'border-2', 'border-dashed', 'border-black/30');
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    setIsDraggedOver(false);
    e.currentTarget.classList.remove('bg-gray-100/50', 'border-2', 'border-dashed', 'border-black/30');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setIsDraggedOver(false);
    e.currentTarget.classList.remove('bg-gray-100/50', 'border-2', 'border-dashed', 'border-black/30');

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json')) as T;
      
      if (data.type === options.itemType && 
          (data.sourceId !== targetId || data.sourceType !== options.sourceType)) {
        
        logger.debug('Item dropped', { 
          item: data,
          targetId,
          targetType: options.sourceType
        });
        
        options.onDrop?.(data, targetId);
        return data;
      }
    } catch (error) {
      logger.error('Failed to process drop:', error);
    }
    return null;
  }, [options]);

  return {
    isDragging,
    isDraggedOver,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
}