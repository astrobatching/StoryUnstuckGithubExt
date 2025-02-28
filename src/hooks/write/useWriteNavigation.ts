import { useState, useCallback } from 'react';
import { defaultActStructure, defaultSceneCounts } from '../../constants/episodes';
import { logger } from '../../utils/logger';

export function useWriteNavigation() {
  const [activeSceneId, setActiveSceneId] = useState<string>();
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  const toggleNavigation = useCallback(() => {
    setIsNavCollapsed(prev => !prev);
  }, []);

  const selectScene = useCallback((sceneId?: string) => {
    logger.debug('Selecting scene', { sceneId });
    setActiveSceneId(sceneId);
  }, []);

  const getSceneCount = useCallback((actId: string) => {
    return defaultSceneCounts[actId] || 0;
  }, []);

  const getSceneTitle = useCallback((sceneId: string) => {
    const [actId, sceneNum] = sceneId.split('-');
    const act = defaultActStructure.find(a => a.id === actId);
    return `${act?.title} Scene ${sceneNum}`;
  }, []);

  return {
    activeSceneId,
    isNavCollapsed,
    toggleNavigation,
    selectScene,
    getSceneCount,
    getSceneTitle,
    acts: defaultActStructure
  };
}