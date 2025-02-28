import { useCallback } from 'react';
import { logger, trackAction } from '../utils/logger';
import type { EpisodeData } from '../types/episodes';

export function useActState(
  episodeId: number,
  updateEpisodeData: (episodeId: number, updater: (data: EpisodeData) => EpisodeData) => void
) {
  const handleAddScene = useCallback((actId: string) => {
    logger.debug('handleAddScene called', { episodeId, actId });

    updateEpisodeData(episodeId, (data) => {
      logger.debug('Current episode data', { data });
      
      const newScene = { 
        id: Date.now(), 
        title: 'New Scene', 
        content: '' 
      };

      logger.debug('Creating new scene', { newScene });

      const updatedData = {
        ...data,
        acts: data.acts.map(act =>
          act.id === actId
            ? {
                ...act,
                scenes: [...act.scenes, newScene]
              }
            : act
        )
      };

      logger.debug('Updated episode data', { updatedData });
      return updatedData;
    });
  }, [episodeId, updateEpisodeData]);

  const handleDeleteAct = useCallback((actId: string) => {
    updateEpisodeData(episodeId, data => ({
      ...data,
      acts: data.acts.filter(act => act.id !== actId)
    }));
  }, [episodeId, updateEpisodeData]);

  const handleActTitleChange = useCallback((actId: string, title: string) => {
    updateEpisodeData(episodeId, data => ({
      ...data,
      acts: data.acts.map(act =>
        act.id === actId ? { ...act, title } : act
      )
    }));
  }, [episodeId, updateEpisodeData]);

  const handleActSubtitleChange = useCallback((actId: string, subtitle: string) => {
    updateEpisodeData(episodeId, data => ({
      ...data,
      acts: data.acts.map(act =>
        act.id === actId ? { ...act, subtitle } : act
      )
    }));
  }, [episodeId, updateEpisodeData]);

  return {
    handleAddScene: trackAction('handleAddScene', handleAddScene, 'ActState'),
    handleDeleteAct: trackAction('handleDeleteAct', handleDeleteAct, 'ActState'),
    handleActTitleChange: trackAction('handleActTitleChange', handleActTitleChange, 'ActState'),
    handleActSubtitleChange: trackAction('handleActSubtitleChange', handleActSubtitleChange, 'ActState'),
  };
}