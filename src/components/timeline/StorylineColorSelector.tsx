import React from 'react';
import { Palette } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useTimelineStore } from '../../store/timelineStore';

interface StorylineColorSelectorProps {
  onColorSelect: (storylineId: string, color: string) => void;
  className?: string;
}

export const StorylineColorSelector: React.FC<StorylineColorSelectorProps> = ({
  onColorSelect,
  className
}) => {
  const storylines = useTimelineStore(state => state.storylines);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 p-1 hover:bg-gray-100"
      >
        <Palette className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border-2 border-black rounded shadow-lg z-50 p-2">
          <div className="grid grid-cols-2 gap-1">
            {storylines.map(storyline => (
              <button
                key={storyline.id}
                onClick={() => {
                  onColorSelect(storyline.id, storyline.color);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded w-full"
              >
                <div 
                  className="w-4 h-4 rounded" 
                  style={{ backgroundColor: storyline.color }}
                />
                <span className="text-xs truncate">{storyline.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};