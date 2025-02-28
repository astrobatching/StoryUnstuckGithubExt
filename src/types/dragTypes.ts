import type { CardState } from './card';

export interface DragMetadata {
  sourceView: 'workshop' | 'timeline' | 'episodes' | 'prompts';
  sourceContainer: {
    type: 'quadrant' | 'track' | 'act' | 'prompt-section';
    id: string;
  };
  position: {
    index: number;
    parentId: string;
  };
}

export interface CardDragData extends CardState {
  metadata: DragMetadata;
}

export interface DragPayload {
  type: 'card';
  data: CardDragData;
}