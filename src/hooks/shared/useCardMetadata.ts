import { useState, useCallback } from 'react';
import { logger } from '../../utils/logger';
import type { CardMetadata } from '../../types/card';

interface UseCardMetadataProps {
  initialMetadata?: CardMetadata;
  onMetadataChange?: (metadata: CardMetadata) => void;
}

export function useCardMetadata({ initialMetadata, onMetadataChange }: UseCardMetadataProps) {
  const [metadata, setMetadata] = useState<CardMetadata>(initialMetadata || {
    storylineId: null,
    color: null,
    relationships: {
      timelineId: null,
      episodeId: null
    }
  });

  const updateColor = useCallback((color: string | null) => {
    setMetadata(prev => {
      const updated = { ...prev, color };
      onMetadataChange?.(updated);
      logger.debug('Card color updated:', { color });
      return updated;
    });
  }, [onMetadataChange]);

  const updateStorylineId = useCallback((storylineId: string | null) => {
    setMetadata(prev => {
      const updated = { ...prev, storylineId };
      onMetadataChange?.(updated);
      logger.debug('Card storyline updated:', { storylineId });
      return updated;
    });
  }, [onMetadataChange]);

  const updateRelationships = useCallback((relationships: Partial<CardMetadata['relationships']>) => {
    setMetadata(prev => {
      const updated = {
        ...prev,
        relationships: {
          ...prev.relationships,
          ...relationships
        }
      };
      onMetadataChange?.(updated);
      logger.debug('Card relationships updated:', relationships);
      return updated;
    });
  }, [onMetadataChange]);

  const resetMetadata = useCallback(() => {
    setMetadata({
      storylineId: null,
      color: null,
      relationships: {
        timelineId: null,
        episodeId: null
      }
    });
    logger.debug('Card metadata reset');
  }, []);

  return {
    metadata,
    updateColor,
    updateStorylineId,
    updateRelationships,
    resetMetadata
  };
}