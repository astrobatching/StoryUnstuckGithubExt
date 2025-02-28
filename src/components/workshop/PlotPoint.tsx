import React, { useState, memo } from 'react';
import { Grip, Edit, X } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface PlotPointProps {
  point: {
    id: string;
    content: string;
    sectionId: string;
  };
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export const PlotPoint = memo(({
  point,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}: PlotPointProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(point.content);

  const handleSave = () => {
    if (editContent.trim() !== point.content) {
      onUpdate(point.id, editContent.trim());
    }
    setIsEditing(false);
  };

  return (
    <div 
      className={cn(
        "bg-white border-2 h-32",
        "p-3 transition-all duration-200 group",
        "hover:shadow-md",
        isSelected ? "border-black" : "border-black/20 hover:border-black"
      )}
      onClick={() => !isEditing && onSelect(point.id)}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start gap-2 mb-2">
          <Grip className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0 cursor-move" />
          
          <div className="flex gap-1 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-1"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(point.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1">
          {isEditing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onBlur={handleSave}
              className="w-full h-full p-2 text-sm resize-none focus:outline-none border-2 border-black"
              placeholder="Add plot point..."
              autoFocus
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
                if (e.key === 'Escape') {
                  setEditContent(point.content);
                  setIsEditing(false);
                }
              }}
            />
          ) : (
            <div 
              className="w-full h-full p-2 text-sm cursor-text"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              {point.content || <span className="text-gray-400">Click to add plot point...</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

PlotPoint.displayName = 'PlotPoint';