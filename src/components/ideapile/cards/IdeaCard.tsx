import React, { useState } from 'react';
import { Grip, Edit, X, Tag, Link as LinkIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';
import type { IdeaItem } from '../../../types/ideapile';

interface IdeaCardProps {
  item: IdeaItem;
  onUpdate: (updates: Partial<IdeaItem>) => void;
  onDelete: () => void;
  onAssignToProject: (projectId: string, projectName: string, usage: string) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export function IdeaCard({
  item,
  onUpdate,
  onDelete,
  onAssignToProject,
  onAddTag,
  onRemoveTag
}: IdeaCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editContent, setEditContent] = useState(item.content);

  const handleSave = () => {
    if (editTitle.trim() || editContent.trim()) {
      onUpdate({
        title: editTitle.trim(),
        content: editContent.trim()
      });
    }
    setIsEditing(false);
  };

  return (
    <div className={cn(
      'bg-white border-4 border-black p-4 rounded-lg',
      'hover:-translate-y-1 hover:shadow-lg',
      'transition-all duration-200 group'
    )}>
      <div className="flex items-start gap-2 mb-4">
        <Grip className="h-4 w-4 text-gray-400 mt-1 cursor-move" />
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full font-bold text-lg border-2 border-black px-2 py-1"
              autoFocus
            />
          ) : (
            <h3 className="font-bold text-lg truncate">{item.title}</h3>
          )}
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
            {item.source && (
              <>
                <span>•</span>
                <a
                  href={item.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  <LinkIcon className="h-3 w-3" />
                  Source
                </a>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="h-8 w-8 p-1"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full h-32 border-2 border-black p-2 font-mono text-sm mb-4"
        />
      ) : (
        <p className="font-mono text-sm mb-4 line-clamp-3">{item.content}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {item.tags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-sm rounded-full group-hover:bg-gray-200"
          >
            <Tag className="h-3 w-3" />
            {tag}
            <button
              onClick={() => onRemoveTag(tag)}
              className="ml-1 hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const tag = prompt('Enter new tag:');
            if (tag?.trim()) {
              onAddTag(tag.startsWith('#') ? tag : `#${tag}`);
            }
          }}
          className="px-2 py-1 h-auto text-sm"
        >
          Add Tag
        </Button>
      </div>
    </div>
  );
}