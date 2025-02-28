import { useState, useCallback } from 'react';
import { logger } from '../../utils/logger';
import type { Scene, Note } from '../../types/write';

const STORAGE_KEY = 'scene_data';

const DEFAULT_BEATS = [
  { id: '1', title: 'SETUP', notes: '', color: 'bg-blue-500' },
  { id: '2', title: 'CONFLICT', notes: '', color: 'bg-red-500' },
  { id: '3', title: 'ESCALATION', notes: '', color: 'bg-yellow-500' },
  { id: '4', title: 'CLIMAX', notes: '', color: 'bg-purple-500' },
  { id: '5', title: 'RESOLUTION', notes: '', color: 'bg-green-500' }
];

const DEFAULT_CHARACTERS = [
  { id: '1', name: 'PROTAGONIST', isActive: true },
  { id: '2', name: 'ANTAGONIST', isActive: false },
  { id: '3', name: 'SUPPORTING', isActive: false }
];

export function useSceneState(sceneId: string) {
  const [scene, setScene] = useState<Scene | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${sceneId}`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [tags, setTags] = useState<string[]>(['confrontation', 'revelation', 'mystery']);

  const initializeScene = useCallback((newScene: Partial<Scene>) => {
    logger.debug('Initializing scene', { sceneId, scene: newScene });
    
    const initialScene: Scene = {
      id: sceneId,
      title: newScene.title || 'New Scene',
      content: newScene.content || '',
      notes: newScene.notes || [],
      characters: DEFAULT_CHARACTERS,
      emotionalStart: 'Neutral',
      emotionalEnd: 'Neutral',
      emotionalProgress: 50,
      isPositiveArc: true,
      beats: DEFAULT_BEATS
    };

    setScene(initialScene);
    localStorage.setItem(`${STORAGE_KEY}_${sceneId}`, JSON.stringify(initialScene));
  }, [sceneId]);

  const updateScene = useCallback((updates: Partial<Scene>) => {
    logger.debug('Updating scene', { sceneId, updates });
    setScene(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem(`${STORAGE_KEY}_${sceneId}`, JSON.stringify(updated));
      return updated;
    });
  }, [sceneId]);

  const addTag = useCallback(() => {
    const tag = prompt('Enter new tag:');
    if (tag) {
      setTags(prev => [...prev, tag]);
    }
  }, []);

  const addNote = useCallback((content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      user: 'User',
      content,
      time: new Date().toLocaleString()
    };
    updateScene({
      notes: scene ? [...scene.notes, newNote] : [newNote]
    });
  }, [scene, updateScene]);

  return {
    scene,
    tags,
    notes: scene?.notes || [],
    initializeScene,
    updateScene,
    addTag,
    addNote
  };
}