import { useCallback } from 'react';
import { logger } from '../../utils/logger';

interface DragPosition {
  position: 'before' | 'after';
  index: number;
}

export function useDragPosition() {
  const calculatePosition = useCallback((e: React.DragEvent, element: HTMLElement): DragPosition => {
    const rect = element.getBoundingClientRect();
    const mouseY = e.clientY;
    const threshold = rect.top + (rect.height * 0.5);
    const position = mouseY < threshold ? 'before' : 'after';

    logger.debug('Calculated drop position:', { mouseY, threshold, position });
    
    return {
      position,
      index: parseInt(element.dataset.index || '0', 10)
    };
  }, []);

  const updateVisualIndicator = useCallback((element: HTMLElement, position: 'before' | 'after') => {
    element.style.borderTop = position === 'before' ? '2px solid black' : '';
    element.style.borderBottom = position === 'after' ? '2px solid black' : '';
  }, []);

  const clearVisualIndicator = useCallback((element: HTMLElement) => {
    element.style.borderTop = '';
    element.style.borderBottom = '';
  }, []);

  return {
    calculatePosition,
    updateVisualIndicator,
    clearVisualIndicator
  };
}