import React from 'react';
import { Link2, ExternalLink } from 'lucide-react';
import { Button } from '../../../ui/button';
import type { SpineContentProps } from '../types';

export function LinkPreview({ content, metadata }: SpineContentProps) {
  const url = metadata?.linkUrl || content;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Link2 className="h-4 w-4 text-gray-500" />
        <a 
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-sm font-mono flex-1 truncate"
        >
          {url}
        </a>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(url, '_blank')}
          className="h-6 w-6 p-1"
        >
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
      {content !== url && (
        <p className="text-sm font-mono">{content}</p>
      )}
    </div>
  );
}