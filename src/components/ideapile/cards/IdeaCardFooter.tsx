import React from 'react';
import { Tag, Link as LinkIcon, Plus } from 'lucide-react';
import { Button } from '../../ui/button';

interface IdeaCardFooterProps {
  tags: string[];
  source?: string;
  onAddTag: () => void;
}

export const IdeaCardFooter: React.FC<IdeaCardFooterProps> = ({
  tags,
  source,
  onAddTag
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-wrap gap-1">
        {tags.map((tag, index) => (
          <span 
            key={index}
            className="px-2 py-1 bg-gray-100 text-sm rounded-full flex items-center gap-1"
          >
            <Tag className="h-3 w-3" />
            {tag}
          </span>
        ))}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onAddTag}
        className="h-6 w-6 p-1"
      >
        <Plus className="h-3 w-3" />
      </Button>
      {source && (
        <a 
          href={source}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
        >
          <LinkIcon className="h-3 w-3" />
          Source
        </a>
      )}
    </div>
  );
};