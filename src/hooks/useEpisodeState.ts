import { useState, useCallback } from 'react';
import { defaultActStructure } from '../constants/episodes';
import type { EpisodeData } from '../types/episodes';

const STORAGE_KEY = 'episode_data';

// Default episode data with initial scenes
const defaultEpisodeData: Record<number, EpisodeData> = {
  1: {
    acts: defaultActStructure.map(act => ({
      ...act,
      scenes: [
        {
          id: 1,
          title: 'Opening Scene',
          content: 'The episode begins with a striking visual that sets up our main conflict...',
          actId: act.id
        },
        {
          id: 2,
          title: 'Character Introduction',
          content: 'We meet our protagonist in their natural environment, establishing their normal world...',
          actId: act.id
        }
      ]
    }))
  }
};

export function useEpisodeState() {
  const [episodes, setEpisodes] = useState<number[]>([1, 2, 3, 4]);
  const [openEpisodes, setOpenEpisodes] = useState<Set<number>>(new Set([1]));
  const [episodeData, setEpisodeData] = useState<Record<number, EpisodeData>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : null;
      if (!parsed || Object.keys(parsed).length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEpisodeData));
        return defaultEpisodeData;
      }
      return parsed;
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEpisodeData));
      return defaultEpisodeData;
    }
  });

  const saveEpisodeData = useCallback((data: Record<number, EpisodeData>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save episode data:', error);
    }
  }, []);

  const updateEpisodeData = useCallback((
    episodeId: number,
    updater: (data: EpisodeData) => EpisodeData
  ) => {
    setEpisodeData(prev => {
      const next = {
        ...prev,
        [episodeId]: updater(prev[episodeId])
      };
      saveEpisodeData(next);
      return next;
    });
  }, [saveEpisodeData]);

  const toggleEpisode = useCallback((episodeId: number) => {
    setOpenEpisodes(prev => {
      const next = new Set(prev);
      if (next.has(episodeId)) {
        next.delete(episodeId);
      } else {
        next.add(episodeId);
        if (!episodeData[episodeId]) {
          setEpisodeData(prev => {
            const next = {
              ...prev,
              [episodeId]: { 
                acts: defaultActStructure.map(act => ({ 
                  ...act, 
                  scenes: []
                })) 
              }
            };
            saveEpisodeData(next);
            return next;
          });
        }
      }
      return next;
    });
  }, [episodeData, saveEpisodeData]);

  const addEpisode = useCallback(() => {
    const newEp = Math.max(...episodes) + 1;
    setEpisodes(prev => [...prev, newEp]);
    toggleEpisode(newEp);
  }, [episodes, toggleEpisode]);

  return {
    episodes,
    openEpisodes,
    episodeData,
    toggleEpisode,
    updateEpisodeData,
    addEpisode
  };
}