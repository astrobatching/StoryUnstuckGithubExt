import React from 'react';
import { TimelineGrid } from './TimelineGrid';
import { ColorLegend } from './ColorLegend';
import { useStorylines } from '../../hooks/useStorylines';

export const TimelineContent: React.FC = () => {
  const {
    storylines,
    addStoryline,
    deleteStoryline,
    editStoryline,
    duplicateStoryline,
    toggleEpisode
  } = useStorylines();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <TimelineGrid
          storylines={storylines}
          onDeleteStoryline={deleteStoryline}
          onEditStoryline={editStoryline}
          onToggleEpisode={toggleEpisode}
          onAddStoryline={addStoryline}
          onDuplicateStoryline={duplicateStoryline}
        />
      </div>
      <ColorLegend
        storylines={storylines}
        onDelete={deleteStoryline}
        onDuplicate={duplicateStoryline}
        onEdit={editStoryline}
      />
    </div>
  );
};