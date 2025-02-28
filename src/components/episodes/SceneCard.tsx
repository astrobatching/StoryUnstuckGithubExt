import React, { useState } from 'react';
import { Grip, X } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import type { Scene } from '../../types/episode';

interface SceneCardProps {
  scene: Scene;
  onUpdate: (updates: Partial<Scene>) => void;
  onDelete: () => void;
}

export const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(scene.content || '');

  const handleSave = () => {
    if (editContent.trim() !== scene.content) {
      onUpdate({ content: editContent.trim() });
    }
    setIsEditing(false);
  };

  return (
    <div 
      draggable
      className={cn(
        "group relative bg-white border-2 border-black/20 hover:border-black p-1", // Reduced padding
        "hover:shadow-sm transition-all duration-200 cursor-move"
      )}
    >
      <div className="flex items-start gap-1"> {/* Reduced gap */}
        <Grip className="h-3 w-3 text-gray-400 mt-1 flex-shrink-0 cursor-move" /> {/* Smaller icon */}
        
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
                setEditContent(scene.content || '');
                setIsEditing(false);
              }
            }}
            className={cn(
              "w-full p-1 border-2 border-black font-mono text-xs resize-none", // Smaller text and padding
              "focus:outline-none focus:ring-2 focus:ring-black"
            )}
            autoFocus
          />
        ) : (
          <div 
            onClick={() => setIsEditing(true)}
            className="flex-1 font-mono text-xs cursor-text min-w-0" // Smaller text
          >
            {scene.content || <span className="text-gray-400">Scene {scene.id}</span>}
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 p-0.5" // Smaller button
        >
          <X className="h-3 w-3" /> {/* Smaller icon */}
        </Button>
      </div>
    </div>
  );
};