import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

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
    <div className="border-l-4 border-black flex h-full sticky top-0 right-0 z-20">
      <div className="flex flex-col h-full py-1">
        {episodes.map(ep => (
          <button
            key={ep}
            onClick={() => onEpisodeToggle(ep)}
            className={cn(
              'w-8 flex-1 border-2 border-black',
              'flex items-center justify-center rotate-180',
              'transition-colors duration-200',
              openEpisodes.has(ep) ? 'bg-[#00FFF0]' : 'bg-white hover:bg-gray-100'
            )}
            style={{ writingMode: 'vertical-rl' }}
          >
            <span className="font-mono text-xs">
              EP_{String(ep).padStart(2, '0')}
            </span>
          </button>
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