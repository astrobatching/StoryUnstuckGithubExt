import React, { useState } from 'react';
import { Grip, Edit, X } from 'lucide-react';
import { Button } from '../ui/button';

interface PlottingCardProps {
  id: string;
  content: string;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onDragStart: () => void;
}

export const PlottingCard: React.FC<PlottingCardProps> = ({
  id,
  content,
  onUpdate,
  onDelete,
  onDragStart,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  const handleSave = () => {
    onUpdate(id, editContent);
    setIsEditing(false);
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="bg-white border-2 border-black p-2 cursor-move"
    >
      <div className="flex justify-between items-start gap-2 mb-1">
        <Grip className="h-4 w-4 text-gray-400" />
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(id)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {isEditing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full h-20 border-2 border-black p-1 text-sm"
          autoFocus
        />
      ) : (
        <p className="text-sm">{content}</p>
      )}
    </div>
  );
};