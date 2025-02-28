import React from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface TimelineHeaderProps {
  onAddStoryline: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  onAddStoryline,
  isCollapsed,
  onToggleCollapse
}) => {
  return (
    <div 
      className={cn(
        "flex items-center justify-between px-4 py-2 border-b-4 border-black",
        "transition-all duration-300 ease-in-out",
        isCollapsed && "h-12"
      )}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="hover:bg-gray-100"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        <h2 className="font-bold">Story Timeline</h2>
      </div>

      {!isCollapsed && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onAddStoryline}
          className="hover:bg-gray-100 border-2 border-black"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Storyline
        </Button>
      )}
    </div>
  );
};