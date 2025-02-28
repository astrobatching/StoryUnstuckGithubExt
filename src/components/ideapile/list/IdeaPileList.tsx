import React from 'react';
import { IdeaCard } from '../cards/IdeaCard';
import type { IdeaItem } from '../../../types/ideapile';

interface IdeaPileListProps {
  items: IdeaItem[];
  onUpdateItem: (id: string, updates: Partial<IdeaItem>) => void;
  onDeleteItem: (id: string) => void;
  onAssignToProject: (itemId: string, projectId: string, projectName: string, usage: string) => void;
  onAddTag: (itemId: string, tag: string) => void;
  onRemoveTag: (itemId: string, tag: string) => void;
}

export function IdeaPileList({
  items,
  onUpdateItem,
  onDeleteItem,
  onAssignToProject,
  onAddTag,
  onRemoveTag
}: IdeaPileListProps) {
  return (
    <div className="space-y-4">
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