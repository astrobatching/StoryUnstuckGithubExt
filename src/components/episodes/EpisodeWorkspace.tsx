import React from 'react';
import { ActSection } from './ActSection';
import type { Episode } from '../../types/episode';

type EpisodeWorkspaceProps = {
  episode: Episode;
  viewMode: 'collapsed' | 'preview' | 'full' | 'multi';
};

export const EpisodeWorkspace: React.FC<EpisodeWorkspaceProps> = ({
  episode,
  viewMode,
}) => {
  const handleBeatClick = (beatId: string) => {
    // Handle beat click - expand for editing
    console.log('Beat clicked:', beatId);
  };

  return (
    <div className="flex-1 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Episode {episode.number}</h2>
          <p className="text-gray-600">{episode.title}</p>
        </div>
        <div className="flex gap-2">
          <select
            className="border-4 border-black p-2"
            value={viewMode}
            onChange={(e) =>
              console.log('View mode changed:', e.target.value)
            }
          >
            <option value="collapsed">Collapsed</option>
            <option value="preview">Preview</option>
            <option value="full">Full View</option>
            <option value="multi">Multi-Episode</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {episode.acts.map(act => (
          <ActSection
            key={act.id}
            act={act}
            onBeatClick={handleBeatClick}
          />
        ))}
      </div>
    </div>
  );
};