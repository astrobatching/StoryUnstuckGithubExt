import React from 'react';
import { Plus } from 'lucide-react';
import { EpisodeSpineButton } from './EpisodeSpineButton';

interface EpisodeSpineProps {
  episodes: number[];
  openEpisodes: Set<number>;
  onEpisodeToggle: (ep: number) => void;
  onAddEpisode: () => void;
}

export const EpisodeSpine: React.FC<EpisodeSpineProps> = ({
  episodes,
  openEpisodes,
  onEpisodeToggle,
  onAddEpisode,
}) => {
  return (
    <div className="border-l-4 border-black flex h-full">
      <div className="flex flex-col h-full py-1">
        {episodes.map(ep => (
          <EpisodeSpineButton
            key={ep}
            episodeNumber={ep}
            isOpen={openEpisodes.has(ep)}
            onToggle={onEpisodeToggle}
          />
        ))}
        {episodes.length < 8 && (
          <button
            onClick={onAddEpisode}
            className="w-8 h-8 border-2 border-black hover:bg-gray-100 flex items-center justify-center"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};