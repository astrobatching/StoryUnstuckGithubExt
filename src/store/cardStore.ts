import { create } from 'zustand';
import { logger } from '../utils/logger';
import type { CardState, CardMetadata } from '../types/card';
import type { DragMetadata } from '../types/dragTypes';

interface CardStoreState {
  cards: CardState[];
  dragMetadata: Record<string, DragMetadata>;
  addCard: (card: Omit<CardState, 'id'>, metadata: DragMetadata) => string;
  moveCard: (id: string, newLocation: string, metadata: DragMetadata) => void;
  removeCard: (id: string) => void;
  getCardsByLocation: (location: string) => CardState[];
  getCardMetadata: (id: string) => DragMetadata | undefined;
  updateCardMetadata: (id: string, metadata: Partial<CardMetadata>) => void;
}

export const useCardStore = create<CardStoreState>((set, get) => ({
  cards: [],
  dragMetadata: {},

  addCard: (card, metadata) => {
    const id = Date.now().toString();
    const newCard: CardState = {
      id,
      content: card.content,
      source: card.source,
      currentLocation: card.currentLocation,
      metadata: {
        storylineId: null,
        color: null,
        relationships: {
          timelineId: null,
          episodeId: null
        }
      }
    };

    // Remove any existing cards at the same location
    const existingCards = get().cards.filter(c => 
      c.currentLocation === card.currentLocation && c.content === card.content
    );
    
    if (existingCards.length > 0) {
      logger.debug('Removing duplicate cards:', existingCards);
      set(state => ({
        cards: state.cards.filter(c => !existingCards.find(ec => ec.id === c.id))
      }));
    }

    set((state) => ({
      cards: [...state.cards, newCard],
      dragMetadata: {
        ...state.dragMetadata,
        [id]: metadata
      }
    }));

    logger.debug('Card added:', { card: newCard, metadata });
    return id;
  },

  moveCard: (id, newLocation, metadata) => {
    // Check for existing card at target location
    const existingCard = get().cards.find(c => 
      c.currentLocation === newLocation && c.id !== id
    );

    if (existingCard) {
      logger.debug('Removing existing card at location:', { existingCard, newLocation });
      set(state => ({
        cards: state.cards.filter(c => c.id !== existingCard.id)
      }));
    }

    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === id
          ? { ...card, currentLocation: newLocation }
          : card
      ),
      dragMetadata: {
        ...state.dragMetadata,
        [id]: metadata
      }
    }));

    logger.debug('Card moved:', { id, newLocation, metadata });
  },

  removeCard: (id) => {
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== id),
      dragMetadata: {
        ...state.dragMetadata,
        [id]: undefined
      }
    }));

    logger.debug('Card removed:', { id });
  },

  getCardsByLocation: (location) => {
    return get().cards.filter((card) => card.currentLocation === location);
  },

  getCardMetadata: (id) => {
    return get().dragMetadata[id];
  },

  updateCardMetadata: (id, metadata) => {
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === id
          ? {
              ...card,
              metadata: {
                ...card.metadata,
                ...metadata
              }
            }
          : card
      )
    }));

    logger.debug('Card metadata updated:', { id, metadata });
  }
}));