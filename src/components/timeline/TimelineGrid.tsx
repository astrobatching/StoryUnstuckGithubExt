import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../ui/button';
import { StorylineRow } from './StorylineRow';
import { useTimelineStore } from '../../store/timelineStore';
import { cn } from '../../lib/utils';

// Define episodes array for the timeline
const EPISODES = Array.from({ length: 8 }, (_, i) => `EP_${String(i + 1).padStart(2, '0')}`);

export const TimelineGrid: React.FC = () => {
  const { 
    storylines, 
    addStoryline, 
    addEpisode,
    removeEpisode,
    episodes
  } = useTimelineStore();

  const handleAddEpisode = () => {
    const newEpisodeNumber = episodes.length + 1;
    const newEpisodeId = `EP_${String(newEpisodeNumber).padStart(2, '0')}`;
    addEpisode(newEpisodeId);
  };

  const handleRemoveEpisode = (episodeId: string) => {
    if (episodes.length <= 1) {
      alert("Cannot remove the last episode");
      return;
    }
    
    if (confirm(`Are you sure you want to remove ${episodeId}?`)) {
      removeEpisode(episodeId);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="grid grid-cols-[200px_1fr] gap-1 bg-gray-100 p-2 sticky top-0 z-10">
        <div className="font-bold text-sm flex items-center justify-between">
          <span>Storylines</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => addStoryline('New Storyline')}
            className="h-6 w-6 p-1"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${episodes.length}, 1fr)` }}>
          {episodes.map(episode => (
            <div key={episode} className="font-bold text-sm text-center truncate relative group">
              {episode}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveEpisode(episode)}
                className="absolute right-0 top-0 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                title={`Remove ${episode}`}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddEpisode}
            className="h-6 w-6 p-1 flex items-center justify-center"
            title="Add Episode"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* Storyline Rows */}
      <div className="space-y-1 p-2">
        {storylines.map(storyline => (
          <StorylineRow
            key={storyline.id}
            storyline={storyline}
            episodes={episodes}
          />
        ))}
      </div>
    </div>
  );
};