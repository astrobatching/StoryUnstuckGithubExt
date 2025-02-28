import { useState, useCallback, useEffect } from 'react';
import { logger } from '../../utils/logger';
import type { Scene } from '../../types/episode';

const STORAGE_KEY = 'episode_scenes';

export function useEpisodeScenes(episodeId: number, actId: string) {
  const storageKey = `${STORAGE_KEY}_${episodeId}_${actId}`;

  const [scenes, setScenes] = useState<Scene[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      logger.error('Failed to load scenes:', error);
      return [];
    }
  });

  // Save scenes whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(scenes));
    } catch (error) {
      logger.error('Failed to save scenes:', error);
    }
  }, [scenes, storageKey]);

  const addScene = useCallback(() => {
    logger.debug('Adding new scene', { episodeId, actId });
    const newScene: Scene = {
      id: Date.now(),
      title: `Scene ${scenes.length + 1}`,
      content: '',
      actId,
      episodeId
    };
    setScenes(prev => [...prev, newScene]);
  }, [actId, episodeId, scenes.length]);

  const updateScene = useCallback((sceneId: number, updates: Partial<Scene>) => {
    logger.debug('Updating scene', { sceneId, updates });
    setScenes(prev => 
      prev.map(scene => 
        scene.id === sceneId ? { ...scene, ...updates } : scene
      )
    );
  }, []);

  const deleteScene = useCallback((sceneId: number) => {
    logger.debug('Deleting scene', { sceneId });
    setScenes(prev => prev.filter(scene => scene.id !== sceneId));
  }, []);

  return {
    scenes,
    addScene,
    updateScene,
    deleteScene
  };
}