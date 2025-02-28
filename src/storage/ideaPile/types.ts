import type { Column, IdeaItem } from '../../types/ideapile';

export interface IdeaPileStorage {
  columns: Column[];
  lastUpdated: string;
}

export interface StorageOperations {
  getColumns: () => Column[];
  saveColumns: (columns: Column[]) => void;
  addItem: (columnId: string, item: Omit<IdeaItem, 'id' | 'createdAt'>) => void;
  moveItem: (itemId: string, targetColumnId: string) => void;
  updateItem: (itemId: string, updates: Partial<IdeaItem>) => void;
  deleteItem: (itemId: string) => void;
}