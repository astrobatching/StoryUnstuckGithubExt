```typescript
import { useCallback } from 'react';
import { useDragDrop } from '../contexts/DragDropContext';
import { logger } from '../utils/logger';
import type { DragItem } from '../contexts/DragDropContext';

export function useDragHandlers() {
  const { state, dispatch } = useDragDrop();

  const handleDragStart = useCallback((e: React.DragEvent, item: DragItem) => {
    try {
      // Set drag data
      e.dataTransfer.setData('application/json', JSON.stringify(item));
      
      // Update global state
      dispatch({ type: 'START_DRAG', payload: item });
      
      // Add visual feedback
      e.currentTarget.classList.add('opacity-50');
      
      logger.debug('Drag started:', item);
    } catch (error) {
      logger.error('Drag start failed:', error);
    }
  }, [dispatch]);

  const handleDragOver = useCallback((e: React.DragEvent, targetId: string, index: number) => {
    if (!state.active) return;

    e.preventDefault();
    e.stopPropagation();

    // Calculate drop position
    const rect = e.currentTarget.getBoundingClientRect();
    const position = e.clientY < (rect.top + rect.height / 2) ? 'before' : 'after';

    // Update target info
    dispatch({ type: 'UPDATE_TARGET', payload: { id: targetId, index } });
    dispatch({ type: 'SET_POSITION', payload: position });
  }, [state.active, dispatch]);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    try {
      // Remove visual feedback
      e.currentTarget.classList.remove('opacity-50');
      
      // Reset state
      dispatch({ type: 'END_DRAG' });
      
      logger.debug('Drag ended');
    } catch (error) {
      logger.error('Drag end failed:', error);
      // Ensure state is reset even on error
      dispatch({ type: 'RESET' });
    }
  }, [dispatch]);

  return {
    handleDragStart,
    handleDragOver,
    handleDragEnd
  };
}
```