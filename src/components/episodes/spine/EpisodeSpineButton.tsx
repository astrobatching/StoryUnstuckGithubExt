import React from 'react';
import { cn } from '../../../lib/utils';

interface EpisodeSpineButtonProps {
  episodeNumber: number;
  isOpen: boolean;
  onToggle: (episodeNumber: number) => void;
}

export const EpisodeSpineButton: React.FC<EpisodeSpineButtonProps> = ({
  episodeNumber,
  isOpen,
  onToggle,
}) => {
  return (
    <button
      onClick={() => onToggle(episodeNumber)}
      className={cn(
        'w-8 flex-1 border-2 border-black',
        'flex items-center justify-center rotate-180',
        'transition-colors duration-200',
        isOpen ? 'bg-[#00FFF0]' : 'bg-white hover:bg-gray-100'
      )}
      style={{ writingMode: 'vertical-rl' }}
    >
      <span className="font-mono text-xs">
        EP_{String(episodeNumber).padStart(2, '0')}
      </span>
    </button>
  );
};