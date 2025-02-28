import React from 'react';
import { Grip, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { SPINE_CONFIGS } from './constants';
import type { ContentType } from '../../../types/ideapile';

interface SpineHeaderProps {
  type: ContentType;
  title: string;
  preview: string;
  timestamp: string;
  isExpanded: boolean;
  onToggle: () => void;
  onDragStart: (e: React.DragEvent) => void;
}

export function SpineHeader({
  type,
  title,
  preview,
  timestamp,
  isExpanded,
  onToggle,
  onDragStart
}: SpineHeaderProps) {
  const config = SPINE_CONFIGS[type];
  const Icon = config.icon;

  return (
    <div 
      className={cn(
        'group flex items-center gap-2 p-3 cursor-pointer',
        'border-l-4 transition-colors duration-200',
        config.colors.border,
        !isExpanded && config.colors.hover
      )}
      onClick={onToggle}
    >
      <Grip 
        className="h-4 w-4 text-gray-400 cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
        onMouseDown={onDragStart}
      />
      <Icon className="h-4 w-4 text-gray-500 flex-shrink-0" />
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{title}</h4>
        {!isExpanded && (
          <p className="text-xs text-gray-500 truncate">{preview}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">{timestamp}</span>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-400" />
        )}
      </div>
    </div>
  );
}