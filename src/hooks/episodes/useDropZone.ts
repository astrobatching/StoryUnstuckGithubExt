import { useState, useCallback } from 'react';
import { logger } from '../../utils/logger';

export function useDropZone(onDrop: (data: any) => void) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('application/json')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      
      if (!isOver) {
        setIsOver(true);
        e.currentTarget.classList.add('bg-gray-100/50', 'border-2', 'border-dashed', 'border-black/30');
      }
    }
  }, [isOver]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Only remove highlight if actually leaving the element
    if (x < 0 || y < 0 || x >= rect.width || y >= rect.height) {
      setIsOver(false);
      e.currentTarget.classList.remove('bg-gray-100/50', 'border-2', 'border-dashed', 'border-black/30');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    e.currentTarget.classList.remove('bg-gray-100/50', 'border-2', 'border-dashed', 'border-black/30');

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type === 'scene') {
        logger.debug('Dropping scene:', data);
        onDrop(data);
      }
    } catch (error) {
      logger.error('Failed to process drop:', error);
    }
  }, [onDrop]);

  return {
    isOver,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
}