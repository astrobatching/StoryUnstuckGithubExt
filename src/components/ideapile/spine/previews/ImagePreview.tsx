import React from 'react';
import { Camera } from 'lucide-react';
import type { SpineContentProps } from '../types';

export function ImagePreview({ content, metadata }: SpineContentProps) {
  return (
    <div className="space-y-2">
      {metadata?.imageUrl ? (
        <img 
          src={metadata.imageUrl} 
          alt={content}
          className="max-h-48 object-cover rounded border-2 border-black"
        />
      ) : (
        <div className="h-48 bg-gray-100 rounded border-2 border-black flex items-center justify-center">
          <Camera className="h-8 w-8 text-gray-400" />
        </div>
      )}
      <p className="text-sm font-mono">{content}</p>
    </div>
  );
}