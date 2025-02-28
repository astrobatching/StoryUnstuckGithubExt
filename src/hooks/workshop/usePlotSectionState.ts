import { useState, useCallback } from 'react';
import type { PlotPoint } from '../../types/workshop';

export function usePlotSectionState(sectionId: string) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleCardSelect = useCallback((cardId: string) => {
    setSelectedCard(cardId);
  }, []);

  const handleAddCard = useCallback((point: PlotPoint) => {
    setSelectedCard(point.id);
  }, []);

  return {
    selectedCard,
    handleCardSelect,
    handleAddCard
  };
}