export interface StorylineCard {
  id: string;
  content: string;
  source: 'workshop' | 'chat' | 'manual';
  color?: string;
  storylineId?: string;
  episodeId?: string;
  position?: number;
  metadata?: {
    originalQuadrant?: string;
    originalSection?: string;
    tags?: string[];
  };
}

export interface Storyline {
  id: string;
  title: string;
  color: string;
  episodes: Record<string, boolean>;
  cards: StorylineCard[];
}

export interface TimelineState {
  storylines: Storyline[];
  unassignedCards: StorylineCard[];
  height: number;
  isCollapsed: boolean;
}

export interface DragData {
  type: 'storyline-card';
  source: 'workshop' | 'chat' | 'timeline' | 'legend';
  cardId: string;
  storylineId?: string;
  episodeId?: string;
}

export type DropTarget = {
  type: 'storyline' | 'episode' | 'legend';
  storylineId?: string;
  episodeId?: string;
  position?: number;
};