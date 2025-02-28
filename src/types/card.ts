export interface CardMetadata {
  storylineId: string | null;
  color: string | null;
  relationships: {
    timelineId: string | null;
    episodeId: string | null;
  };
}

export interface CardState {
  id: string;
  content: string;
  source: 'chat' | 'idea' | 'prompt';
  currentLocation: string;
  metadata?: CardMetadata;
}

export interface CardActions {
  addCard: (card: Omit<CardState, 'id'>) => string;
  moveCard: (id: string, newLocation: string) => void;
  removeCard: (id: string) => void;
  getCardsByLocation: (location: string) => CardState[];
  updateCardMetadata: (id: string, metadata: Partial<CardMetadata>) => void;
}