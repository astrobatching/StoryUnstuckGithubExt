import { create } from 'zustand';
import { logger } from '../utils/logger';
import type { TimelineState, StorylineCard, DropTarget } from '../types/timeline';
import type { Story } from '../types/workshop';

const COLORS = ['#FF3AF2', '#00FFF0', '#FFE600', '#FF4D4D', '#4DFF4D', '#4D4DFF'];

// Default episodes
const DEFAULT_EPISODES = Array.from({ length: 8 }, (_, i) => `EP_${String(i + 1).padStart(2, '0')}`);

// Mock data for testing
const MOCK_CARDS = [
  {
    id: 'mock-1',
    content: 'Character development arc for the protagonist',
    source: 'manual',
    color: 'white'
  },
  {
    id: 'mock-2',
    content: 'Major plot twist in episode 3',
    source: 'manual',
    color: 'white'
  },
  {
    id: 'mock-3',
    content: 'Subplot involving secondary characters',
    source: 'manual',
    color: 'white'
  }
];

interface SectionState {
  timeline: {
    isExpanded: boolean;
    height: number;
  };
  colorLegend: {
    isExpanded: boolean;
    isVisible: boolean;
  };
}

interface WorkshopState {
  stories: Story[];
}

export const useTimelineStore = create<TimelineState & SectionState & WorkshopState & {
  episodes: string[];
  addStoryline: (title: string) => void;
  updateStoryline: (id: string, updates: Partial<Omit<StorylineCard, 'id'>>) => void;
  removeStoryline: (id: string) => void;
  toggleEpisode: (storylineId: string, episodeId: string) => void;
  addCard: (card: Omit<StorylineCard, 'id'>) => string;
  moveCard: (cardId: string, target: DropTarget | { type: 'workshop'; quadrantId: string; position: number }) => void;
  removeCard: (cardId: string) => void;
  deleteAllCards: () => void;
  toggleTimelineExpanded: () => void;
  toggleColorLegendExpanded: () => void;
  setColorLegendVisible: (visible: boolean) => void;
  setHeight: (height: number) => void;
  addEpisode: (episodeId: string) => void;
  removeEpisode: (episodeId: string) => void;
}>((set, get) => ({
  storylines: [],
  unassignedCards: MOCK_CARDS.map(card => ({ 
    ...card, 
    id: `mock-${Date.now()}-${Math.random().toString(36).slice(2)}` 
  })),
  stories: [],
  height: 300,
  episodes: [...DEFAULT_EPISODES],

  timeline: {
    isExpanded: false,
    height: 300
  },
  colorLegend: {
    isExpanded: true,
    isVisible: true
  },

  addStoryline: (title) => {
    const id = `storyline-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    set((state) => ({
      storylines: [
        ...state.storylines,
        {
          id,
          title,
          color,
          episodes: {},
          cards: []
        }
      ]
    }));
    
    logger.debug('Storyline added:', { id, title, color });
  },

  updateStoryline: (id, updates) => set((state) => ({
    storylines: state.storylines.map(storyline =>
      storyline.id === id ? { ...storyline, ...updates } : storyline
    )
  })),

  removeStoryline: (id) => set((state) => {
    const storyline = state.storylines.find(s => s.id === id);
    const cardsToUnassign = storyline?.cards || [];
    
    return {
      storylines: state.storylines.filter(s => s.id !== id),
      unassignedCards: [
        ...state.unassignedCards,
        ...cardsToUnassign.map(card => ({
          ...card,
          storylineId: undefined,
          color: 'white'
        }))
      ]
    };
  }),

  toggleEpisode: (storylineId, episodeId) => set((state) => ({
    storylines: state.storylines.map(storyline =>
      storyline.id === storylineId
        ? {
            ...storyline,
            episodes: {
              ...storyline.episodes,
              [episodeId]: !storyline.episodes[episodeId]
            }
          }
        : storyline
    )
  })),

  addCard: (card) => {
    const id = `card-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const newCard: StorylineCard = { 
      id, 
      ...card,
      storylineId: card.storylineId || undefined,
      color: card.storylineId ? card.color : 'white'
    };

    set((state) => ({
      unassignedCards: [...state.unassignedCards, newCard],
      colorLegend: {
        ...state.colorLegend,
        isVisible: true,
        isExpanded: true
      }
    }));

    logger.debug('Card added:', newCard);
    return id;
  },

  moveCard: (cardId, target) => set((state) => {
    let card: StorylineCard | undefined;
    let currentStoryline: string | undefined;

    const unassignedCard = state.unassignedCards.find(c => c.id === cardId);
    if (unassignedCard) {
      card = unassignedCard;
    } else {
      state.storylines.forEach(storyline => {
        const found = storyline.cards.find(c => c.id === cardId);
        if (found) {
          card = found;
          currentStoryline = storyline.id;
        }
      });
    }

    if (!card) {
      logger.error('Card not found:', cardId);
      return state;
    }

    const newState = {
      ...state,
      unassignedCards: state.unassignedCards.filter(c => c.id !== cardId),
      storylines: state.storylines.map(storyline => ({
        ...storyline,
        cards: storyline.cards.filter(c => c.id !== cardId)
      }))
    };

    if (target.type === 'workshop') {
      // Convert card to story
      const newStory: Story = {
        id: Date.now().toString(),
        title: card.content.split('\n')[0] || 'Imported Card',
        content: card.content,
        quadrantId: target.quadrantId
      };

      // Insert at correct position
      const quadrantStories = state.stories.filter(s => s.quadrantId === target.quadrantId);
      const stories = [...state.stories];
      const insertIndex = quadrantStories.length > 0 ? 
        state.stories.indexOf(quadrantStories[target.position]) : 
        state.stories.length;
      
      stories.splice(insertIndex, 0, newStory);
      newState.stories = stories;

      logger.debug('Card moved to workshop:', { cardId, target, newStory });
    } else if (target.type === 'storyline' && target.storylineId) {
      const storyline = newState.storylines.find(s => s.id === target.storylineId);
      if (storyline) {
        const updatedCard = {
          ...card,
          storylineId: target.storylineId,
          episodeId: target.episodeId,
          position: target.position,
          color: storyline.color
        };
        storyline.cards.push(updatedCard);
      }
      logger.debug('Card moved to storyline:', { cardId, from: currentStoryline, to: target });
    } else {
      newState.unassignedCards.push({
        ...card,
        storylineId: undefined,
        episodeId: undefined,
        color: 'white'
      });
    }

    return newState;
  }),

  removeCard: (cardId: string) => set((state) => ({
    unassignedCards: state.unassignedCards.filter(card => card.id !== cardId)
  })),

  deleteAllCards: () => set((state) => {
    logger.debug('Deleting all cards');
    return {
      ...state,
      unassignedCards: [],
      storylines: state.storylines.map(storyline => ({
        ...storyline,
        cards: []
      }))
    };
  }),

  toggleTimelineExpanded: () => set((state) => ({
    timeline: {
      ...state.timeline,
      isExpanded: !state.timeline.isExpanded
    }
  })),

  toggleColorLegendExpanded: () => set((state) => ({
    colorLegend: {
      ...state.colorLegend,
      isExpanded: !state.colorLegend.isExpanded
    }
  })),

  setColorLegendVisible: (visible) => set((state) => ({
    colorLegend: {
      ...state.colorLegend,
      isVisible: visible
    }
  })),

  setHeight: (height) => set((state) => ({
    timeline: {
      ...state.timeline,
      height
    }
  })),

  addEpisode: (episodeId) => set((state) => {
    // Check if episode already exists
    if (state.episodes.includes(episodeId)) {
      return state;
    }

    // Add the new episode
    const newEpisodes = [...state.episodes, episodeId].sort((a, b) => {
      // Extract episode numbers and compare
      const numA = parseInt(a.replace('EP_', ''));
      const numB = parseInt(b.replace('EP_', ''));
      return numA - numB;
    });

    logger.debug('Episode added:', { episodeId, episodes: newEpisodes });
    
    return {
      episodes: newEpisodes
    };
  }),

  removeEpisode: (episodeId) => set((state) => {
    // Remove the episode
    const newEpisodes = state.episodes.filter(ep => ep !== episodeId);
    
    // Update storylines to remove any cards associated with this episode
    const updatedStorylines = state.storylines.map(storyline => {
      // Get cards that need to be moved to unassigned
      const cardsToMove = storyline.cards.filter(card => card.episodeId === episodeId);
      
      // Remove episode from episodes object
      const { [episodeId]: _, ...remainingEpisodes } = storyline.episodes;
      
      return {
        ...storyline,
        episodes: remainingEpisodes,
        cards: storyline.cards.filter(card => card.episodeId !== episodeId)
      };
    });

    // Get all cards that need to be moved to unassigned
    const cardsToUnassign = state.storylines.flatMap(storyline => 
      storyline.cards.filter(card => card.episodeId === episodeId)
        .map(card => ({
          ...card,
          storylineId: undefined,
          episodeId: undefined,
          color: 'white'
        }))
    );

    logger.debug('Episode removed:', { 
      episodeId, 
      newEpisodes, 
      cardsUnassigned: cardsToUnassign.length 
    });
    
    return {
      episodes: newEpisodes,
      storylines: updatedStorylines,
      unassignedCards: [...state.unassignedCards, ...cardsToUnassign]
    };
  })
}));