export interface DragData {
  id: string;
  type: 'scene' | 'act';
  sourceId: string;
  position?: 'before' | 'after';
  index: number;
  data: Record<string, any>;
}

export interface DragState {
  active: boolean;
  data: DragData | null;
  position: 'before' | 'after' | null;
  target: string | null;
}