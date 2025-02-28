import React from 'react';
import { Grip, Copy } from 'lucide-react';
import { Button } from '../ui/button';
import { useDragState } from '../../hooks/shared/useDragState';
import { cn } from '../../lib/utils';
import type { CardState } from '../../types/card';
import type { DragMetadata } from '../../types/dragTypes';

interface ChatMessageProps {
  id: string;
  content: string;
  type: 'user' | 'assistant';
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ id, content, type }) => {
  const { handleDragStart, handleDragEnd } = useDragState();

  const startDrag = (e: React.DragEvent) => {
    const card: CardState = {
      id,
      content,
      source: 'chat',
      currentLocation: 'chat'
    };

    const metadata: DragMetadata = {
      sourceView: 'chat',
      sourceContainer: {
        type: 'quadrant',
        id: 'chat-container'
      },
      position: {
        index: parseInt(e.currentTarget.getAttribute('data-index') || '0'),
        parentId: 'chat-container'
      }
    };

    handleDragStart(e, card, metadata);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div
      draggable
      onDragStart={startDrag}
      onDragEnd={handleDragEnd}
      data-index={id}
      className={cn(
        'p-3 rounded-lg flex items-start gap-2 group relative',
        'border-2 border-black cursor-move transition-all duration-200',
        type === 'assistant' ? 'bg-gray-100' : 'bg-black text-white ml-4',
        'hover:shadow-md hover:scale-[1.01]'
      )}
    >
      <Grip className={cn(
        'h-4 w-4 mt-1 flex-shrink-0',
        type === 'assistant' ? 'text-gray-400' : 'text-gray-500'
      )} />
      
      <div className="flex-1 break-words">{content}</div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className={cn(
          'absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity',
          'h-6 w-6 p-1',
          type === 'assistant' ? 'hover:bg-gray-200' : 'hover:bg-gray-800'
        )}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};