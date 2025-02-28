import React, { useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '../../../ui/button';
import type { SpineContentProps } from '../types';

export function VoicePreview({ content, metadata }: SpineContentProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
          className="h-8 w-8 p-1 border-2 border-black"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        
        <div className="flex-1 h-8 bg-gray-100 rounded border-2 border-black relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Volume2 className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <span className="text-xs font-mono text-gray-500">
          {metadata?.duration || '0:00'}
        </span>
      </div>

      {metadata?.transcription && (
        <p className="text-sm font-mono text-gray-600 italic">
          {metadata.transcription}
        </p>
      )}
      
      <p className="text-sm font-mono">{content}</p>
    </div>
  );
}