import React from 'react';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';
import { getPreviewComponent } from './utils';
import type { SpinePreviewProps } from './types';

export function SpineContent({
  type,
  content,
  metadata,
  tags,
  onEdit,
  onDelete
}: SpinePreviewProps) {
  const PreviewComponent = getPreviewComponent(type);

  return (
    <div className={cn(
      'p-4 border-t border-gray-200',
      'transition-all duration-300'
    )}>
      <PreviewComponent 
        content={content}
        metadata={metadata}
      />
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-1">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-7 px-2 text-xs"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}