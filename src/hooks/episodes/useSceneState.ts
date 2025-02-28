import { useState, useCallback } from 'react';
import type { Scene } from '../../types/episode';

const STORAGE_KEY = 'episode_scenes';

export function useSceneState() {
  const [scenes, setScenes] = useState<Scene[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addScene = useCallback((actId: string) => {
    const newScene: Scene = {
      id: Date.now(),
      title: 'New Scene',
      content: '',
      actId
    };
    setScenes(prev => [...prev, newScene]);
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
    updateScene,
    deleteScene
  };
}