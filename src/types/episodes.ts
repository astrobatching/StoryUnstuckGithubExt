export interface Scene {
  id: number;
  title: string;
  content: string;
}

export interface Act {
  id: string;
  title: string;
  subtitle?: string;
  color: string;
  scenes: Scene[];
}

export interface EpisodeData {
  acts: Act[];
}

export interface EpisodeState {
  episodes: number[];
  openEpisodes: Set<number>;
  episodeData: Record<number, EpisodeData>;
  toggleEpisode: (episodeId: number) => void;
  addEpisode: () => void;
  updateEpisodeData: (episodeId: number, updater: (data: EpisodeData) => EpisodeData) => void;
}