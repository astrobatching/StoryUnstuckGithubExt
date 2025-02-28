import React from 'react';
import { ActCard } from '../acts/ActCard';
import type { EpisodeData } from '../../../types/episodes';

interface EpisodeColumnProps {
  episodeNumber: number;
  data: EpisodeData;
  onUpdateData: (updater: (data: EpisodeData) => EpisodeData) => void;
}

export const EpisodeColumn: React.FC<EpisodeColumnProps> = ({
  episodeNumber,
  data,
  onUpdateData,
}) => {
  return (
    <div className="w-96 flex-shrink-0 p-6 border-r-4 border-black">
      <h1 className="font-mono text-2xl font-bold mb-6">
        EP_{String(episodeNumber).padStart(2, '0')}
      </h1>
      <div className="space-y-4">
        {data.acts.map(act => (
          <ActCard
            key={act.id}
            act={act}
            onUpdateAct={(updates) => {
              onUpdateData(prev => ({
                ...prev,
                acts: prev.acts.map(a => 
                  a.id === act.id ? { ...a, ...updates } : a
                )
              }));
            }}
          />
        ))}
      </div>
    </div>
  );
};