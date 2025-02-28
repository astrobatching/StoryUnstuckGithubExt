import React, { useState } from 'react';
import { Pencil, X, Palette } from 'lucide-react';
import { Button } from '../ui/button';
import { useTimelineStore } from '../../store/timelineStore';
import { cn } from '../../lib/utils';
import type { Storyline } from '../../types/timeline';

interface StorylineRowProps {
  storyline: Storyline;
  episodes: string[];
}

const colorOptions = [
  { name: 'Pink', value: '#FF3AF2' },
  { name: 'Cyan', value: '#00FFF0' },
  { name: 'Yellow', value: '#FFE600' },
  { name: 'Red', value: '#FF4D4D' },
  { name: 'Green', value: '#4DFF4D' },
  { name: 'Blue', value: '#4D4DFF' }
];

export const StorylineRow: React.FC<StorylineRowProps> = ({
  storyline,
  episodes
}) => {
  const { updateStoryline, removeStoryline, toggleEpisode, moveCard } = useTimelineStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(storyline.title);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleEditComplete = () => {
    if (editName.trim() && editName.trim() !== storyline.title) {
      updateStoryline(storyline.id, { title: editName.trim() });
    }
    setIsEditing(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('application/json')) {
      e.preventDefault();
      e.currentTarget.classList.add('bg-gray-100/50');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-gray-100/50');
  };

  const handleDrop = (e: React.DragEvent, episodeId: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-100/50');

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type === 'storyline-card') {
        moveCard(data.cardId, {
          type: 'storyline',
          storylineId: storyline.id,
          episodeId
        });
      }
    } catch (error) {
      console.error('Failed to process drop:', error);
    }
  };

  return (
    <div className="grid grid-cols-[200px_1fr] gap-1">
      {/* Storyline Info */}
      <div className="group relative p-2 font-medium flex items-center gap-2 bg-white border-2 border-black">
        <button 
          className="w-4 h-4 rounded flex-shrink-0 relative group"
          style={{ backgroundColor: storyline.color }}
          onClick={() => setShowColorPicker(!showColorPicker)}
        >
          <Palette className="h-3 w-3 text-white opacity-0 group-hover:opacity-100 absolute inset-0 m-auto transition-opacity" />
        </button>
        
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none text-sm"
            autoFocus
            onBlur={handleEditComplete}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEditComplete();
              if (e.key === 'Escape') {
                setEditName(storyline.title);
                setIsEditing(false);
              }
            }}
          />
        ) : (
          <>
            <span className="flex-1 truncate text-sm">{storyline.title}</span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeStoryline(storyline.id)}
                className="h-6 w-6 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </>
        )}

        {/* Color Picker Dropdown */}
        {showColorPicker && (
          <div className="absolute left-0 top-full mt-1 bg-white border-2 border-black rounded shadow-lg z-50">
            <div className="grid grid-cols-3 gap-1 p-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  className="w-8 h-8 rounded hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: color.value }}
                  onClick={() => {
                    updateStoryline(storyline.id, { color: color.value });
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Episode Grid */}
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${episodes.length}, 1fr)` }}>
        {episodes.map(episode => {
          const cards = storyline.cards.filter(c => c.episodeId === episode);
          
          return (
            <div
              key={episode}
              className="relative h-12"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, episode)}
            >
              <button
                onClick={() => toggleEpisode(storyline.id, episode)}
                className={cn(
                  'w-full h-full border-2 border-black transition-colors',
                  'hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-black'
                )}
                style={{ 
                  backgroundColor: storyline.episodes[episode] ? storyline.color : 'white',
                  opacity: storyline.episodes[episode] ? 1 : 0.5
                }}
              />
              <div className="absolute inset-0 pointer-events-none">
                {cards.map((card, index) => (
                  <div
                    key={card.id}
                    className={cn(
                      'absolute left-1 right-1 p-2',
                      'bg-white/90 border border-black/20',
                      'text-xs rounded shadow-sm',
                      'transform-gpu transition-all duration-300',
                      'timeline-slot-card'
                    )}
                    style={{
                      top: `${index * 2 + 2}px`,
                      zIndex: index,
                      backgroundColor: storyline.color + '20',
                      transform: 'scale(0.8)',
                      transformOrigin: 'top left'
                    }}
                  >
                    <div className="timeline-slot-content whitespace-nowrap overflow-hidden text-ellipsis">
                      {card.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};