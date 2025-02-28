import { useState, useCallback } from 'react';
import type { Story } from '../types/workshop';

const STORAGE_KEY = 'workshop_stories';

// Default stories for initial state
const defaultStories: Story[] = [
  {
    id: '1',
    title: 'Hero\'s Journey',
    content: 'The protagonist begins as an ordinary person, discovers their calling, faces challenges, and emerges transformed.',
    quadrantId: 'q1'
  },
  {
    id: '2',
    title: 'Main Antagonist',
    content: 'A powerful figure whose goals directly oppose the protagonist, creating the central conflict.',
    quadrantId: 'q1'
  },
  {
    id: '3',
    title: 'Key Plot Twist',
    content: 'Midway revelation that changes everything - the mentor figure has been working against our hero.',
    quadrantId: 'q2'
  },
  {
    id: '4',
    title: 'Central Mystery',
    content: 'Strange symbols appear throughout the city, leading to an ancient secret society.',
    quadrantId: 'q2'
  },
  {
    id: '5',
    title: 'Opening Scene',
    content: 'A quiet morning disrupted by an impossible event that sets everything in motion.',
    quadrantId: 'q3'
  }
];

export function useWorkshopState() {
  const [stories, setStories] = useState<Story[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : null;
      if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStories));
        return defaultStories;
      }
      return parsed;
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStories));
      return defaultStories;
    }
  });

  const saveStories = useCallback((newStories: Story[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStories));
    } catch (error) {
      console.error('Failed to save stories:', error);
    }
  }, []);

  const addStory = useCallback((quadrantId: string) => {
    const newStory: Story = {
      id: Date.now().toString(),
      title: 'New Story',
      content: 'Click to edit...',
      quadrantId
    };
    setStories(prev => {
      const next = [...prev, newStory];
      saveStories(next);
      return next;
    });
  }, [saveStories]);

  const updateStory = useCallback((id: string, updates: Partial<Story>) => {
    setStories(prev => {
      const next = prev.map(story => 
        story.id === id ? { ...story, ...updates } : story
      );
      saveStories(next);
      return next;
    });
  }, [saveStories]);

  const deleteStory = useCallback((id: string) => {
    setStories(prev => {
      const next = prev.filter(story => story.id !== id);
      saveStories(next);
      return next;
    });
  }, [saveStories]);

  return {
    stories,
    addStory,
    updateStory,
    deleteStory
  };
}