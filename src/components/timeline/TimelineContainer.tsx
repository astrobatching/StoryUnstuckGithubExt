import React, { useState, useCallback } from 'react';
import { TimelineHeader } from './TimelineHeader';
import { TimelineGrid } from './TimelineGrid';
import { ColorLegend } from './ColorLegend';
import { useStorylines } from '../../hooks/useStorylines';
import { cn } from '../../lib/utils';

interface TimelineContainerProps {
  defaultHeight?: number;
  minHeight?: number;
  maxHeight?: number;
  onHeightChange?: (height: number) => void;
}

export const TimelineContainer: React.FC<TimelineContainerProps> = ({
  defaultHeight = 300,
  minHeight = 100,
  maxHeight = window.innerHeight * 0.5,
  onHeightChange
}) => {
  const [height, setHeight] = useState(defaultHeight);
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const {
    storylines,
    addStoryline,
    deleteStoryline,
    editStoryline,
    duplicateStoryline,
    toggleEpisode
  } = useStorylines();

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = 'ns-resize';
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const newHeight = Math.max(minHeight, Math.min(maxHeight, e.clientY));
    setHeight(newHeight);
    onHeightChange?.(newHeight);
  }, [isResizing, minHeight, maxHeight, onHeightChange]);

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div 
      className={cn(
        "relative bg-white border-b-4 border-black transition-all duration-300",
        isResizing && "select-none"
      )}
      style={{ height: isCollapsed ? '48px' : `${height}px` }}
    >
      <div className="h-full flex flex-col">
        <TimelineHeader 
          onAddStoryline={addStoryline}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
        
        {!isCollapsed && (
          <>
            <div className="flex-1 overflow-hidden">
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
          </>
        )}

        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize",
            "hover:bg-gray-100 transition-colors",
            "after:content-[''] after:absolute after:left-0 after:right-0",
            "after:h-[2px] after:bg-gray-200 after:top-1/2 after:-translate-y-1/2"
          )}
          onMouseDown={handleMouseDown}
        />
      </div>
    </div>
  );
};