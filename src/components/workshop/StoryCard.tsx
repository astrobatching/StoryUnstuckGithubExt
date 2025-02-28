import React, { useState } from 'react';
import { Grip, Edit, X } from 'lucide-react';
import { Button } from '../ui/button';

interface StoryCardProps {
  id: string;
  title: string;
  content: string;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string, content: string) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  id,
  title,
  content,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);

  const handleSave = () => {
    onUpdate(id, editTitle, editContent);
    setIsEditing(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('application/json')) {
      e.preventDefault();
      e.currentTarget.classList.add('border-blue-500');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-blue-500');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500');
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type === 'chat-message') {
        onUpdate(id, title, content + '\n\n' + data.content);
      }
    } catch (err) {
      console.error('Failed to parse dropped data:', err);
    }
  };

  return (
    <div 
      className="bg-white border-4 border-black p-4 mb-4 group transition-colors"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Grip className="h-4 w-4 text-gray-400 cursor-move" />
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="font-bold border-2 border-black px-2 py-1"
              autoFocus
            />
          ) : (
            <h3 className="font-bold">{title}</h3>
          )}
        </div>
        <div className="flex gap-2">
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
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(id)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {isEditing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full h-24 border-2 border-black p-2 font-mono text-sm"
        />
      ) : (
        <p className="font-mono text-sm whitespace-pre-wrap">{content}</p>
      )}
    </div>
  );
};