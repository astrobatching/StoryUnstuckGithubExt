import { useCallback } from 'react';
import { logger } from '../../utils/logger';

interface Position {
  index: number;
  offset: number;
}

export function useDragPosition() {
  const calculatePosition = useCallback((e: React.DragEvent, rect: DOMRect): Position => {
    const mouseY = e.clientY - rect.top;
    const itemHeight = rect.height;
    const index = Math.floor(mouseY / itemHeight);
    const offset = mouseY % itemHeight;

    logger.debug('Position calculated:', { mouseY, itemHeight, index, offset });

    return { index, offset };
  }, []);

  return { calculatePosition };
}