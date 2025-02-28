import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../ui/button';
import { IdeaCard } from '../cards/IdeaCard';
import { cn } from '../../../lib/utils';
import type { Column, IdeaItem, ViewMode } from '../../../types/ideapile';

interface IdeaPileColumnsProps {
  columns: Column[];
  viewMode: ViewMode;
  onUpdateItem: (id: string, updates: Partial<IdeaItem>) => void;
  onDeleteItem: (id: string) => void;
  onAssignToProject: (itemId: string, projectId: string, projectName: string, usage: string) => void;
  onAddTag: (itemId: string, tag: string) => void;
  onRemoveTag: (itemId: string, tag: string) => void;
}

export function IdeaPileColumns({
  columns,
  viewMode,
  onUpdateItem,
  onDeleteItem,
  onAssignToProject,
  onAddTag,
  onRemoveTag
}: IdeaPileColumnsProps) {
  return (
    <div className="flex-1 flex gap-6 p-6 overflow-x-auto">
      {columns.map(column => (
        <div
          key={column.id}
          className="w-96 flex-shrink-0 flex flex-col border-4 border-black bg-white"
        >
          <div className={cn(
            'h-12 flex items-center justify-between px-4',
            column.color,
            'border-b-4 border-black'
          )}>
            <div>
              <h2 className="font-bold text-white">{column.title}</h2>
              <p className="text-sm text-white/80">{column.subtitle}</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => {/* Add item to column */}}
              className="hover:bg-white/20"
            >
              <Plus className="h-4 w-4 text-white" />
            </Button>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {column.items.map(item => (
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
        </div>
      ))}
    </div>
  );
}