import React from 'react';
import { IdeaCard } from '../cards/IdeaCard';
import type { IdeaItem } from '../../../types/ideapile';

interface IdeaPileGridProps {
  items: IdeaItem[];
  onUpdateItem: (id: string, updates: Partial<IdeaItem>) => void;
  onDeleteItem: (id: string) => void;
  onAssignToProject: (itemId: string, projectId: string, projectName: string, usage: string) => void;
  onAddTag: (itemId: string, tag: string) => void;
  onRemoveTag: (itemId: string, tag: string) => void;
}

export function IdeaPileGrid({
  items,
  onUpdateItem,
  onDeleteItem,
  onAssignToProject,
  onAddTag,
  onRemoveTag
}: IdeaPileGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => (
        <IdeaCard
          key={item.id}
          item={item}
          onUpdate={(updates) => onUpdateItem(item.id, updates)}
          onDelete={() => onDeleteItem(item.id)}
          onAssignToProject={(projectId, projectName, usage) =>
            onAssignToProject(item.id, projectId, projectName, usage)
          }
          onAddTag={(tag) => onAddTag(item.id, tag)}
          onRemoveTag={(tag) => onRemoveTag(item.id, tag)}
        />
      ))}
    </div>
  );
}