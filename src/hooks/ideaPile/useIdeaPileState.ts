import { useState, useEffect } from 'react';
import { ideaPileStorage } from '../../storage/ideaPile/storage';
import type { ViewMode, IdeaItem, Column } from '../../types/ideapile';

export function useIdeaPileState() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [columns, setColumns] = useState<Column[]>(() => ideaPileStorage.getColumns());

  // Save columns whenever they change
  useEffect(() => {
    ideaPileStorage.saveColumns(columns);
  }, [columns]);

  const addItem = (columnId: string, item: Omit<IdeaItem, 'id' | 'createdAt'>) => {
    const newItem = ideaPileStorage.addItem(columnId, item);
    setColumns(prev => prev.map(col =>
      col.id === columnId
        ? { ...col, items: [...col.items, newItem] }
        : col
    ));
  };

  const moveItem = (itemId: string, targetColumnId: string) => {
    ideaPileStorage.moveItem(itemId, targetColumnId);
    setColumns(ideaPileStorage.getColumns());
  };

  const updateItem = (itemId: string, updates: Partial<IdeaItem>) => {
    ideaPileStorage.updateItem(itemId, updates);
    setColumns(ideaPileStorage.getColumns());
  };

  const deleteItem = (itemId: string) => {
    ideaPileStorage.deleteItem(itemId);
    setColumns(ideaPileStorage.getColumns());
  };

  return {
    viewMode,
    setViewMode,
    columns,
    addItem,
    moveItem,
    updateItem,
    deleteItem
  };
}