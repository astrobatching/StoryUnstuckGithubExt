import React from 'react';
import { Camera, MessageSquare, Link2, Mic } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { ContentType } from '../../../types/ideapile';

interface IdeaCardContentProps {
  type: ContentType;
  content: string;
  isEditing: boolean;
  editContent: string;
  onEditContentChange: (value: string) => void;
}

const typeIcons: Record<ContentType, typeof Camera> = {
  note: MessageSquare,
  image: Camera,
  voice: Mic,
  link: Link2,
  reference: Link2
};

export const IdeaCardContent: React.FC<IdeaCardContentProps> = ({
  type,
  content,
  isEditing,
  editContent,
  onEditContentChange
}) => {
  const Icon = typeIcons[type];

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2 text-gray-500">
        <Icon className="h-4 w-4" />
        <span className="text-sm capitalize">{type}</span>
      </div>

      {isEditing ? (
        <textarea
          value={editContent}
          onChange={(e) => onEditContentChange(e.target.value)}
          className="w-full h-32 border-2 border-black p-2 font-mono text-sm"
          placeholder="Enter content..."
        />
      ) : (
        <div>
          {type === 'note' && (
            <p className="font-mono text-sm whitespace-pre-wrap">{content}</p>
          )}
          {type === 'image' && (
            <img 
              src={content} 
              alt="Content preview" 
              className="max-h-48 object-cover rounded"
            />
          )}
          {type === 'voice' && (
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
              <Mic className="h-4 w-4" />
              <span className="text-sm">Voice recording</span>
            </div>
          )}
          {(type === 'link' || type === 'reference') && (
            <a 
              href={content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline flex items-center gap-2"
            >
              <Link2 className="h-4 w-4" />
              {content}
            </a>
          )}
        </div>
      )}
    </div>
  );
};