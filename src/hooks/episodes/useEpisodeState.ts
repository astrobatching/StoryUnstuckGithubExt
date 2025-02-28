import { useState, useCallback } from 'react';
import type { EpisodeData } from '../../types/episodes';

export function useEpisodeState() {
  const [openEpisodes, setOpenEpisodes] = useState<Set<number>>(new Set());
  
  const toggleEpisode = useCallback((episodeNumber: number) => {
    setOpenEpisodes(prev => {
      const next = new Set(prev);
      if (next.has(episodeNumber)) {
        next.delete(episodeNumber);
      } else {
        next.add(episodeNumber);
      }
      return next;
    });
  }, []);

  return {
    openEpisodes,
    toggleEpisode
  };
}