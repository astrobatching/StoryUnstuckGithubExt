import { useState, useCallback } from 'react';
import type { Story } from '../../types/workshop';

const STORAGE_KEY = 'workshop_stories';

export function useWorkshopState() {
  const [stories, setStories] = useState<Story[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addStory = useCallback((quadrantId: string) => {
    const newStory: Story = {
      id: Date.now().toString(),
      title: 'New Story',
      content: '',
      quadrantId
    };
    setStories(prev => [...prev, newStory]);
  }, []);

  const updateStory = useCallback((id: string, updates: Partial<Story>) => {
    setStories(prev => 
      prev.map(story => 
        story.id === id ? { ...story, ...updates } : story
      )
    );
  }, []);

  const deleteStory = useCallback((id: string) => {
    setStories(prev => prev.filter(story => story.id !== id));
  }, []);

  return {
    stories,
    addStory,
    updateStory,
    deleteStory
  };
}