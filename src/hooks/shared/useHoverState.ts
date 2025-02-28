import { useState, useCallback } from 'react';
import { logger } from '../../utils/logger';
import type { StorylineCard } from '../../types/timeline';

interface HoverState {
  isHovered: boolean;
  selectedColor: string | null;
  storylineId: string | null;
}

export function useHoverState() {
  const [state, setState] = useState<HoverState>({
    isHovered: false,
    selectedColor: null,
    storylineId: null
  });

  const handleHoverStart = useCallback(() => {
    setState(prev => ({ ...prev, isHovered: true }));
    logger.debug('Card hover started');
  }, []);

  const handleHoverEnd = useCallback(() => {
    setState(prev => ({ ...prev, isHovered: false }));
    logger.debug('Card hover ended');
  }, []);

  const selectStorylineColor = useCallback((storylineId: string, color: string) => {
    setState(prev => ({ 
      ...prev, 
      selectedColor: color,
      storylineId 
    }));
    logger.debug('Storyline color selected:', { storylineId, color });
  }, []);

  const resetSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedColor: null,
      storylineId: null
    }));
    logger.debug('Color selection reset');
  }, []);

  return {
    ...state,
    handleHoverStart,
    handleHoverEnd,
    selectStorylineColor,
    resetSelection
  };
}