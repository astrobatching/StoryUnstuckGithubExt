import { useCallback } from 'react';
import type { EpisodeData } from '../types/episodes';

export function useSceneActions(
  episodeId: number,
  updateEpisodeData: (episodeId: number, updater: (data: EpisodeData) => EpisodeData) => void
) {
  const handleSceneTitleChange = useCallback((
    actId: string,
    sceneId: number,
    title: string
  ) => {
    updateEpisodeData(episodeId, data => ({
      ...data,
      acts: data.acts.map(act =>
        act.id === actId
          ? {
              ...act,
              scenes: act.scenes.map(scene =>
                scene.id === sceneId ? { ...scene, title } : scene
              )
            }
          : act
      )
    }));
  }, [episodeId, updateEpisodeData]);

  const handleSceneDelete = useCallback((actId: string, sceneId: number) => {
    updateEpisodeData(episodeId, data => ({
      ...data,
      acts: data.acts.map(act =>
        act.id === actId
          ? { ...act, scenes: act.scenes.filter(s => s.id !== sceneId) }
          : act
      )
    }));
  }, [episodeId, updateEpisodeData]);

  return {
    handleSceneTitleChange,
    handleSceneDelete
  };
}