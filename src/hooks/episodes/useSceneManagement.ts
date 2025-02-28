import { useState, useCallback } from 'react';
import { logger } from '../../utils/logger';
import type { Scene } from '../../types/episode';

const STORAGE_KEY = 'episode_scenes';

export function useSceneManagement() {
  const [scenesByAct, setScenesByAct] = useState<Record<string, Scene[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const moveScene = useCallback((
    sceneId: number,
    sourceActId: string,
    targetActId: string
  ) => {
    setScenesByAct(prev => {
      const sourceScenes = prev[sourceActId] || [];
      const targetScenes = prev[targetActId] || [];
      
      const sceneToMove = sourceScenes.find(s => s.id === sceneId);
      if (!sceneToMove) return prev;

      logger.debug('Moving scene', {
        scene: sceneToMove,
        from: sourceActId,
        to: targetActId
      });

      return {
        ...prev,
        [sourceActId]: sourceScenes.filter(s => s.id !== sceneId),
        [targetActId]: [...targetScenes, { ...sceneToMove, actId: targetActId }]
      };
    });
  }, []);

  const getScenesForAct = useCallback((actId: string) => {
    return scenesByAct[actId] || [];
  }, [scenesByAct]);

  return {
    moveScene,
    getScenesForAct
  };
}