import React from 'react';
import { Grip, Edit, X } from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';
import type { Scene } from '../../../types/episode';

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
  const [isEditing, setIsEditing] = React.useState(false);
  const [editContent, setEditContent] = React.useState(scene.content || '');

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
        "group relative bg-white border-4 border-black p-4",
        "hover:-translate-y-1 hover:shadow-md",
        "transition-all duration-200 cursor-move"
      )}
    >
      <div className="flex items-start gap-2">
        <Grip className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
        
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
              "w-full p-2 border-2 border-black font-mono text-sm resize-none",
              "focus:outline-none focus:ring-2 focus:ring-black"
            )}
            autoFocus
          />
        ) : (
          <div 
            onClick={() => setIsEditing(true)}
            className="flex-1 font-mono text-sm cursor-text min-w-0"
          >
            {scene.content || <span className="text-gray-400">Click to add content...</span>}
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-1"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};