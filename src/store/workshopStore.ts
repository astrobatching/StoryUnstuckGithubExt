import { create } from 'zustand';
import { logger } from '../utils/logger';
import type { Story } from '../types/workshop';
import type { StorylineCard } from '../types/timeline';

interface WorkshopState {
  stories: Story[];
  unassignedCards: StorylineCard[];
  addStory: (quadrantId: string) => void;
  updateStory: (id: string, updates: Partial<Story>) => void;
  deleteStory: (id: string) => void;
  moveCardToWorkshop: (card: StorylineCard, quadrantId: string, position: number) => void;
  removeUnassignedCard: (cardId: string) => void;
}

export const useWorkshopStore = create<WorkshopState>((set, get) => ({
  stories: [],
  unassignedCards: [],

  addStory: (quadrantId: string) => {
    const newStory: Story = {
      id: Date.now().toString(),
      title: 'New Story',
      content: '',
      quadrantId
    };
    set(state => ({
      stories: [...state.stories, newStory]
    }));
    logger.debug('Story added:', { story: newStory });
  },

  updateStory: (id: string, updates: Partial<Story>) => {
    set(state => ({
      stories: state.stories.map(story =>
        story.id === id ? { ...story, ...updates } : story
      )
    }));
    logger.debug('Story updated:', { id, updates });
  },

  deleteStory: (id: string) => {
    set(state => ({
      stories: state.stories.filter(story => story.id !== id)
    }));
    logger.debug('Story deleted:', { id });
  },

  moveCardToWorkshop: (card: StorylineCard, quadrantId: string, position: number) => {
    // Convert timeline card to workshop story
    const newStory: Story = {
      id: Date.now().toString(),
      title: card.content.split('\n')[0] || 'Imported Card', // Use first line as title
      content: card.content,
      quadrantId
    };

    set(state => {
      // Get existing stories for this quadrant
      const quadrantStories = state.stories.filter(s => s.quadrantId === quadrantId);
      
      // Insert new story at the specified position
      const updatedStories = [...state.stories];
      const insertIndex = quadrantStories.length > 0 ? 
        state.stories.indexOf(quadrantStories[position]) : 
        state.stories.length;
      
      updatedStories.splice(insertIndex, 0, newStory);

      return {
        stories: updatedStories,
        // Remove the card from unassigned cards if it exists there
        unassignedCards: state.unassignedCards.filter(c => c.id !== card.id)
      };
    });

    logger.debug('Card moved to workshop:', { card, quadrantId, position, newStory });
  },

  removeUnassignedCard: (cardId: string) => {
    set(state => ({
      unassignedCards: state.unassignedCards.filter(card => card.id !== cardId)
    }));
    logger.debug('Unassigned card removed:', { cardId });
  }
}));