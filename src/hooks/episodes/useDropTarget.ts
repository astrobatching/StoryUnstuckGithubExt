import { useState, useCallback } from 'react';

export function useDropTarget() {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('application/json')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setIsOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeaving = 
      e.clientX <= rect.left ||
      e.clientX >= rect.right ||
      e.clientY <= rect.top ||
      e.clientY >= rect.bottom;

    if (isLeaving) {
      setIsOver(false);
    }
  }, []);

  return {
    isOver,
    handleDragOver,
    handleDragLeave,
    setIsOver
  };
}