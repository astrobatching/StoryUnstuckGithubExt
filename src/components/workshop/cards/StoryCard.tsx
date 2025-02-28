import React, { useState } from 'react';
import { Grip, Edit, X } from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';

interface StoryCardProps {
  story: {
    id: string;
    title: string;
    content: string;
  };
  onDelete: () => void;
  onUpdate: (updates: { title: string; content: string }) => void;
  isCollapsed?: boolean;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  onDelete,
  onUpdate,
  isCollapsed = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(story.title);
  const [editContent, setEditContent] = useState(story.content);

  const handleSave = () => {
    if (editTitle.trim() || editContent.trim()) {
      onUpdate({
        title: editTitle.trim() || 'Untitled',
        content: editContent.trim()
      });
    }
    setIsEditing(false);
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (isEditing) {
      e.preventDefault();
      return;
    }

    const dragData = {
      type: 'story-card',
      id: story.id,
      title: story.title,
      content: story.content
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  return (
    <div 
      draggable={!isEditing}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        "h-full bg-white border-4 border-black",
        isCollapsed ? "p-1" : "p-2",
        !isEditing && "hover:-translate-y-0.5 hover:shadow-md",
        "transition-all duration-200",
        isEditing ? "cursor-text" : "cursor-move",
        "group flex flex-col"
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-1 mb-1 min-h-[20px]">
        <Grip className={cn(
          "h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0",
          isEditing && "opacity-50"
        )} />
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSave();
                }
                if (e.key === 'Escape') {
                  setEditTitle(story.title);
                  setEditContent(story.content);
                  setIsEditing(false);
                }
              }}
              className={cn(
                "w-full font-bold border-2 border-black px-1 py-0.5",
                "focus:outline-none focus:ring-2 focus:ring-black",
                isCollapsed ? "text-[8px]" : "text-sm"
              )}
              autoFocus
            />
          ) : (
            <h3 
              className={cn(
                "font-bold truncate cursor-text",
                isCollapsed ? "text-[8px] leading-tight" : "text-sm"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              {story.title || 'Untitled'}
            </h3>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className={cn(
            "opacity-0 group-hover:opacity-100 transition-opacity",
            isCollapsed ? "h-4 w-4 p-0.5" : "h-6 w-6 p-1"
          )}
        >
          <X className={cn("h-4 w-4", isCollapsed && "h-3 w-3")} />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSave();
              }
              if (e.key === 'Escape') {
                setEditTitle(story.title);
                setEditContent(story.content);
                setIsEditing(false);
              }
            }}
            className={cn(
              "w-full h-full resize-none border-2 border-black font-mono",
              "focus:outline-none focus:ring-2 focus:ring-black",
              isCollapsed ? "text-[6px] leading-tight p-0.5" : "text-xs p-1"
            )}
            placeholder="Enter story content..."
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="h-full cursor-text"
          >
            <p className={cn(
              "font-mono break-words overflow-hidden",
              isCollapsed 
                ? "text-[6px] leading-tight line-clamp-4" 
                : "text-xs line-clamp-5"
            )}>
              {story.content || 'Click to add content...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};