import { useState, useCallback, useEffect } from 'react';

const COLORS = ['#FF3AF2', '#00FFF0', '#FFE600', '#FF4D4D', '#4DFF4D', '#4D4DFF'];
const STORAGE_KEY = 'storylines';

export interface Storyline {
  id: string;
  name: string;
  color: string;
  episodes: Record<string, boolean>;
}

export function useStorylines() {
  const [storylines, setStorylines] = useState<Storyline[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [
        {
          id: '1',
          name: 'Main Plot',
          color: '#FF3AF2',
          episodes: { 'EP_01': true, 'EP_02': true, 'EP_03': true }
        },
        {
          id: '2',
          name: 'Character Arc',
          color: '#00FFF0',
          episodes: { 'EP_01': false, 'EP_02': true, 'EP_03': false }
        }
      ];
    } catch {
      return [];
    }
  });

  // Save storylines whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storylines));
    } catch (error) {
      console.error('Failed to save storylines:', error);
    }
  }, [storylines]);

  const addStoryline = useCallback(() => {
    const newStoryline: Storyline = {
      id: Date.now().toString(),
      name: `Storyline ${storylines.length + 1}`,
      color: COLORS[storylines.length % COLORS.length],
      episodes: {}
    };
    setStorylines(prev => [...prev, newStoryline]);
  }, [storylines.length]);

  const deleteStoryline = useCallback((id: string) => {
    setStorylines(prev => prev.filter(sl => sl.id !== id));
  }, []);

  const editStoryline = useCallback((id: string, name: string) => {
    setStorylines(prev => prev.map(sl => 
      sl.id === id ? { ...sl, name } : sl
    ));
  }, []);

  const duplicateStoryline = useCallback((id: string) => {
    setStorylines(prev => {
      const original = prev.find(s => s.id === id);
      if (!original) return prev;
      
      const newStoryline: Storyline = {
        ...original,
        id: Date.now().toString(),
        name: `${original.name} (Copy)`,
        color: COLORS[prev.length % COLORS.length],
      };
      return [...prev, newStoryline];
    });
  }, []);

  const toggleEpisode = useCallback((storylineId: string, episodeId: string) => {
    setStorylines(prev => prev.map(sl =>
      sl.id === storylineId
        ? { ...sl, episodes: { ...sl.episodes, [episodeId]: !sl.episodes[episodeId] }}
        : sl
    ));
  }, []);

  return {
    storylines,
    addStoryline,
    deleteStoryline,
    editStoryline,
    duplicateStoryline,
    toggleEpisode
  };
}