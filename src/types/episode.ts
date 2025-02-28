export interface Scene {
  id: number;
  title: string;
  content: string;
  actId: string;
  episodeId?: number;
}

export interface Act {
  id: string;
  title: string;
  subtitle?: string;
  color: string;
  scenes: Scene[];
}

export interface Episode {
  id: number;
  acts: Act[];
}

export interface DragData {
  type: 'scene-card';
  sceneId: number;
  sourceActId: string;
  sourceEpisodeId: number;
  title: string;
  content: string;
}