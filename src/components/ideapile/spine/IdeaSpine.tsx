import React from 'react';
import { SpineHeader } from './SpineHeader';
import { SpineContent } from './SpineContent';
import { cn } from '../../../lib/utils';
import { SPINE_CONFIGS } from './constants';
import type { IdeaItem } from '../../../types/ideapile';

interface IdeaSpineProps {
  item: IdeaItem;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: (updates: Partial<IdeaItem>) => void;
  onDelete: () => void;
}

export function IdeaSpine({
  item,
  isExpanded,
  onToggle,
  onEdit,
  onDelete
}: IdeaSpineProps) {
  const config = SPINE_CONFIGS[item.type];

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'idea-item',
      id: item.id,
      columnId: item.columnId
    }));
  };

  const handleEdit = () => {
    onEdit({ id: item.id, isEditing: true });
  };

  return (
    <div className={cn(
      'border-b border-gray-200',
      config.colors.border,
      !isExpanded && config.colors.hover
    )}>
      <SpineHeader
        type={item.type}
        title={item.title}
        preview={item.content}
        timestamp={new Date(item.createdAt).toLocaleString()}
        isExpanded={isExpanded}
        onToggle={onToggle}
        onDragStart={handleDragStart}
      />

      {isExpanded && (
        <SpineContent
          type={item.type}
          content={item.content}
          metadata={item.metadata}
          tags={item.tags}
          onEdit={handleEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}