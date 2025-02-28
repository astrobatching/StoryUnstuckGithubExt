import React, { useState } from 'react';
import { Grip, Edit, X } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import type { DragItem } from '../../types/workshop';

interface PlotPointCardProps {
  id: string;
  content: string;
  sectionId: string;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export const PlotPointCard: React.FC<PlotPointCardProps> = ({
  id,
  content,
  sectionId,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [isDragging, setIsDragging] = useState(false);

  const handleSave = () => {
    if (editContent.trim()) {
      onUpdate(id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.currentTarget.classList.add('opacity-50');

    const dragData: DragItem = {
      id,
      type: 'plot-point',
      sectionId,
      content
    };

    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        "aspect-[3/2] bg-white border-2 border-black p-3",
        "hover:shadow-md hover:-translate-y-0.5",
        "transition-all duration-200 group",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-start gap-2 h-full">
        <Grip className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0 cursor-move" />
        
        <div className="flex-1 min-w-0 flex flex-col">
          {isEditing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
                if (e.key === 'Escape') {
                  setEditContent(content);
                  setIsEditing(false);
                }
              }}
              className="flex-1 p-1 text-sm border-2 border-black resize-none focus:outline-none focus:ring-2 focus:ring-black"
              autoFocus
            />
          ) : (
            <div 
              onClick={() => setIsEditing(true)}
              className="flex-1 text-sm cursor-text"
            >
              {content || <span className="text-gray-400">New plot point...</span>}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-1"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};