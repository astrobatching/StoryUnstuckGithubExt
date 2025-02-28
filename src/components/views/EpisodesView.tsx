import React, { useState } from 'react';
import { EpisodeSpine } from '../episodes/EpisodeSpine';
import { ActCard } from '../episodes/ActCard';
import { useEpisodeState } from '../../hooks/useEpisodeState';

export const EpisodesView: React.FC = () => {
  const {
    episodes,
    openEpisodes,
    episodeData,
    toggleEpisode,
    addEpisode,
    updateEpisodeData
  } = useEpisodeState();

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      <div className="flex-1 overflow-x-auto">
        <div className="flex min-h-full">
          {Array.from(openEpisodes)
            .sort((a, b) => a - b)
            .map(ep => (
              <div key={ep} className="w-96 flex-shrink-0 p-6 border-r-4 border-black">
                <h1 className="font-mono text-2xl font-bold mb-6">
                  EP_{String(ep).padStart(2, '0')}
                </h1>
                <div className="space-y-4">
                  {episodeData[ep]?.acts.map(act => (
                    <ActCard
                      key={act.id}
                      act={act}
                      onAddScene={() => {/* Add scene handler */}}
                      onDeleteAct={() => {/* Delete act handler */}}
                      onSceneTitleChange={() => {/* Scene title change handler */}}
                      onSceneDelete={() => {/* Scene delete handler */}}
                      onActTitleChange={() => {/* Act title change handler */}}
                      onActSubtitleChange={() => {/* Act subtitle change handler */}}
                      onSceneDrop={() => {/* Scene drop handler */}}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      <EpisodeSpine
        episodes={episodes}
        openEpisodes={openEpisodes}
        onEpisodeToggle={toggleEpisode}
        onAddEpisode={addEpisode}
      />
    </div>
  );
};