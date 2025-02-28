import { useState, useCallback, useEffect } from 'react';
import { logger } from '../../utils/logger';
import type { Scene } from '../../types/episode';

export function useActScenes(actId: string, episodeId: number) {
  const [scenes, setScenes] = useState<Scene[]>(() => {
    try {
      const saved = localStorage.getItem(`act_scenes_${actId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`act_scenes_${actId}`, JSON.stringify(scenes));
    } catch (error) {
      logger.error('Failed to save scenes:', error);
    }
  }, [scenes, actId]);

  const addScene = useCallback(() => {
    const newScene: Scene = {
      id: Date.now(),
      title: `Scene ${scenes.length + 1}`,
      content: '',
      actId,
      episodeId
    };
    setScenes(prev => [...prev, newScene]);
    logger.debug('Added new scene:', newScene);
  }, [scenes.length, actId, episodeId]);

  const moveScene = useCallback((sceneId: number, targetActId: string) => {
    setScenes(prev => prev.filter(s => s.id !== sceneId));
  }, []);

  const addMovedScene = useCallback((scene: Scene) => {
    setScenes(prev => [...prev, scene]);
  }, []);

  const updateScene = useCallback((id: number, updates: Partial<Scene>) => {
    setScenes(prev =>
      prev.map(scene =>
        scene.id === id ? { ...scene, ...updates } : scene
      )
    );
  }, []);

  const deleteScene = useCallback((id: number) => {
    setScenes(prev => prev.filter(scene => scene.id !== id));
  }, []);

  return {
    scenes,
    addScene,
    moveScene,
    addMovedScene,
    updateScene,
    deleteScene
  };
}