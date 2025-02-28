import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../ui/button';
import { IdeaSpine } from '../spine/IdeaSpine';
import { cn } from '../../../lib/utils';
import type { Column, IdeaItem } from '../../../types/ideapile';

interface IdeaPileColumnProps {
  column: Column;
  onAddItem: (columnId: string) => void;
  onMoveItem: (itemId: string, targetColumnId: string) => void;
  onUpdateItem: (itemId: string, updates: Partial<IdeaItem>) => void;
  onDeleteItem: (itemId: string) => void;
}

export function IdeaPileColumn({
  column,
  onAddItem,
  onMoveItem,
  onUpdateItem,
  onDeleteItem
}: IdeaPileColumnProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('application/json')) {
      e.preventDefault();
      e.currentTarget.classList.add('bg-gray-100');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-gray-100');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-100');

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type === 'idea-item' && data.columnId !== column.id) {
        onMoveItem(data.id, column.id);
      }
    } catch (error) {
      console.error('Failed to process drop:', error);
    }
  };

  const handleEdit = (itemId: string, updates: Partial<IdeaItem>) => {
    if (typeof onUpdateItem === 'function') {
      onUpdateItem(itemId, updates);
    }
  };

  return (
    <div className="w-96 flex-shrink-0 flex flex-col border-4 border-black bg-white">
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
          size="sm"
          onClick={() => onAddItem(column.id)}
          className="hover:bg-white/20"
        >
          <Plus className="h-4 w-4 text-white" />
        </Button>
      </div>

      <div 
        className="flex-1 overflow-y-auto"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {column.items.map(item => (
          <IdeaSpine
            key={item.id}
            item={item}
            isExpanded={expandedItems.has(item.id)}
            onToggle={() => toggleItem(item.id)}
            onEdit={(updates) => handleEdit(item.id, updates)}
            onDelete={() => onDeleteItem(item.id)}
          />
        ))}
      </div>
    </div>
  );
}