import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { StoryCard } from './cards/StoryCard';
import { cn } from '../../lib/utils';
import { useTimelineStore } from '../../store/timelineStore';
import type { Story } from '../../types/workshop';

interface PlotSectionProps {
  id: string;
  title: string;
  color: string;
  guide: string;
  stories: Story[];
  onAddStory: (story?: Partial<Story>) => void;
  onUpdateStory: (id: string, updates: Partial<Story>) => void;
  onDeleteStory: (id: string) => void;
  onUpdateSection: (id: string, updates: { title?: string; subtitle?: string }) => void;
}

export const PlotSection: React.FC<PlotSectionProps> = ({
  id,
  title,
  color,
  guide,
  stories,
  onAddStory,
  onUpdateStory,
  onDeleteStory,
  onUpdateSection
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(title);
  const moveCard = useTimelineStore(state => state.moveCard);

  const handleTitleSave = () => {
    if (editTitle.trim() && editTitle.trim() !== title) {
      onUpdateSection(id, { title: editTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleDrop = (e: React.DragEvent, position: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-100/50', 'border-2', 'border-dashed', 'border-black/30');

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type === 'storyline-card') {
        moveCard(data.id, {
          type: 'workshop',
          quadrantId: id,
          position
        });
      }
    } catch (error) {
      console.error('Failed to process drop:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('application/json')) {
      e.preventDefault();
      e.currentTarget.classList.add('bg-gray-100/50', 'border-2', 'border-dashed', 'border-black/30');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-gray-100/50', 'border-2', 'border-dashed', 'border-black/30');
  };

  // Create array of 5 slots with memoized story lookup
  const slots = React.useMemo(() => 
    Array.from({ length: 5 }, (_, i) => ({
      index: i,
      story: stories[i]
    }))
  , [stories]);

  return (
    <div className="border-4 border-black">
      {/* Header - Reduced height */}
      <div className={cn(
        'h-6 flex items-center justify-between px-2',
        color,
        'border-b-4 border-black'
      )}>
        <div className="flex-1 flex items-center gap-1 min-w-0">
          {isEditingTitle ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSave();
                if (e.key === 'Escape') {
                  setEditTitle(title);
                  setIsEditingTitle(false);
                }
              }}
              className="flex-1 bg-white/10 border-none rounded text-white font-bold text-xs px-1"
              autoFocus
            />
          ) : (
            <div className="flex flex-col leading-none">
              <h3 className="font-bold text-xs text-white truncate">{title}</h3>
              <p className="text-[10px] text-white/80 truncate">{guide}</p>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddStory()}
          className="hover:bg-white/20 h-4 w-4 p-0"
        >
          <Plus className="h-3 w-3 text-white" />
        </Button>
      </div>

      {/* Grid Layout */}
      <div className={cn(
        "grid grid-cols-5 gap-4",
        isExpanded ? "p-4" : "p-1",
        "transition-all duration-300 ease-in-out"
      )}>
        {slots.map(({ index, story }) => (
          <div
            key={index}
            className={cn(
              "aspect-[4/3]",
              !isExpanded && "transform-gpu scale-90 origin-top-left"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
          >
            {story ? (
              <StoryCard
                story={story}
                onUpdate={(updates) => onUpdateStory(story.id, updates)}
                onDelete={() => onDeleteStory(story.id)}
                isCollapsed={!isExpanded}
              />
            ) : (
              <div 
                className={cn(
                  "w-full h-full border-2 border-dashed border-black/20 hover:border-black",
                  "transition-colors cursor-pointer flex items-center justify-center",
                  !isExpanded && "opacity-0 pointer-events-none"
                )}
                onClick={() => onAddStory()}
              >
                <Plus className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};