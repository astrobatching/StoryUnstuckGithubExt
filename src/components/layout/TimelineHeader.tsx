import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { TimelineGrid } from '../timeline/TimelineGrid';
import { ColorLegend } from '../timeline/ColorLegend';

interface TimelineHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  isCollapsed
}) => {
  const [storylines, setStorylines] = useState([
    {
      id: '1',
      name: 'Main Plot',
      color: '#FF3AF2',
      episodes: { 'EP_01': true, 'EP_02': true, 'EP_03': true }
    },
    {
      id: '2',
      name: 'Character Arc',
      color: '#00FFF0',
      episodes: { 'EP_01': false, 'EP_02': true, 'EP_03': false }
    }
  ]);

  const colors = ['#FF3AF2', '#00FFF0', '#FFE600', '#FF4D4D', '#4DFF4D', '#4D4DFF'];

  const handleAddStoryline = () => {
    const newStoryline = {
      id: Date.now().toString(),
      name: `Storyline ${storylines.length + 1}`,
      color: colors[storylines.length % colors.length],
      episodes: {}
    };
    setStorylines([...storylines, newStoryline]);
  };

  const handleDuplicateStoryline = (id: string) => {
    const original = storylines.find(s => s.id === id);
    if (original) {
      const newStoryline = {
        ...original,
        id: Date.now().toString(),
        name: `${original.name} (Copy)`,
        color: colors[storylines.length % colors.length],
      };
      setStorylines([...storylines, newStoryline]);
    }
  };

  const handleDeleteStoryline = (id: string) => {
    setStorylines(storylines.filter(s => s.id !== id));
  };

  const handleEditStoryline = (id: string, newName: string) => {
    setStorylines(storylines.map(s => 
      s.id === id ? { ...s, name: newName } : s
    ));
  };

  const handleToggleEpisode = (storylineId: string, episodeId: string) => {
    setStorylines(storylines.map(s =>
      s.id === storylineId
        ? { ...s, episodes: { ...s.episodes, [episodeId]: !s.episodes[episodeId] }}
        : s
    ));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <h2 className="font-bold">Story Timeline</h2>
            <Button variant="ghost" size="sm" onClick={handleAddStoryline}>
              <Plus className="h-4 w-4" />
              Add Storyline
            </Button>
          </div>
        </div>

        {!isCollapsed && (
          <>
            <div className="flex-1 overflow-auto">
              <TimelineGrid
                storylines={storylines}
                onDeleteStoryline={handleDeleteStoryline}
                onEditStoryline={handleEditStoryline}
                onToggleEpisode={handleToggleEpisode}
                onAddStoryline={handleAddStoryline}
                onDuplicateStoryline={handleDuplicateStoryline}
              />
            </div>
            <ColorLegend
              storylines={storylines}
              onDelete={handleDeleteStoryline}
              onDuplicate={handleDuplicateStoryline}
              onEdit={handleEditStoryline}
            />
          </>
        )}
      </div>
    </div>
  );
};