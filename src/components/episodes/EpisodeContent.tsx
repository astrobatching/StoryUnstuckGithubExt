import React from 'react';
import { ActCard } from './ActCard';
import { useActState } from '../../hooks/useActState';
import type { EpisodeData } from '../../types/episode';

interface EpisodeContentProps {
  episodeId: number;
  episodeData: EpisodeData;
  onUpdateData: (updater: (data: EpisodeData) => EpisodeData) => void;
}

export const EpisodeContent: React.FC<EpisodeContentProps> = ({
  episodeId,
  episodeData,
  onUpdateData,
}) => {
  const {
    handleAddScene,
    handleDeleteAct,
    handleActTitleChange,
    handleActSubtitleChange,
    handleSceneTitleChange,
    handleSceneDelete,
    handleSceneDrop,
  } = useActState(episodeId, onUpdateData);

  return (
    <div className="w-96 flex-shrink-0 flex flex-col border-r-4 border-black">
      {/* Episode number on the side */}
      <div className="flex items-stretch border-b-4 border-black">
        <div className="w-12 bg-gray-100 flex items-center justify-center font-mono text-sm font-bold border-r-4 border-black">
          EP_{String(episodeId).padStart(2, '0')}
        </div>
        <div className="flex-1 h-8" /> {/* Empty space for alignment */}
      </div>

      <div className="flex-1 p-4 space-y-4">
        {episodeData.acts.map(act => (
          <ActCard
            key={act.id}
            act={act}
            onAddScene={() => handleAddScene(act.id)}
            onDeleteAct={() => handleDeleteAct(act.id)}
            onActTitleChange={(title) => handleActTitleChange(act.id, title)}
            onActSubtitleChange={(subtitle) => handleActSubtitleChange(act.id, subtitle)}
            onSceneTitleChange={(sceneId, title) => handleSceneTitleChange(act.id, sceneId, title)}
            onSceneDelete={(sceneId) => handleSceneDelete(act.id, sceneId)}
            onSceneDrop={(sceneData) => handleSceneDrop(act.id, sceneData)}
          />
        ))}
      </div>
    </div>
  );
};