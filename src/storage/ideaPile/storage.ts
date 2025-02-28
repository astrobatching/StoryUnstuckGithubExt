import { STORAGE_KEY, DEFAULT_COLUMNS } from './constants';
import type { Column, IdeaItem } from '../../types/ideapile';
import type { IdeaPileStorage, StorageOperations } from './types';

function loadFromStorage(): IdeaPileStorage {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) throw new Error('No saved data');
    return JSON.parse(saved);
  } catch {
    return {
      columns: DEFAULT_COLUMNS,
      lastUpdated: new Date().toISOString()
    };
  }
}

function saveToStorage(data: IdeaPileStorage) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...data,
      lastUpdated: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Failed to save idea pile data:', error);
  }
}

export const ideaPileStorage: StorageOperations = {
  getColumns() {
    return loadFromStorage().columns;
  },

  saveColumns(columns: Column[]) {
    saveToStorage({ columns, lastUpdated: new Date().toISOString() });
  },

  addItem(columnId: string, item: Omit<IdeaItem, 'id' | 'createdAt'>) {
    const storage = loadFromStorage();
    const newItem: IdeaItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    const updatedColumns = storage.columns.map(col =>
      col.id === columnId
        ? { ...col, items: [...col.items, newItem] }
        : col
    );

    saveToStorage({ ...storage, columns: updatedColumns });
    return newItem;
  },

  moveItem(itemId: string, targetColumnId: string) {
    const storage = loadFromStorage();
    const sourceColumn = storage.columns.find(col =>
      col.items.some(item => item.id === itemId)
    );

    if (!sourceColumn) return;

    const item = sourceColumn.items.find(i => i.id === itemId);
    if (!item) return;

    const updatedColumns = storage.columns.map(col => {
      if (col.id === sourceColumn.id) {
        return {
          ...col,
          items: col.items.filter(i => i.id !== itemId)
        };
      }
      if (col.id === targetColumnId) {
        return {
          ...col,
          items: [...col.items, { ...item, columnId: targetColumnId }]
        };
      }
      return col;
    });

    saveToStorage({ ...storage, columns: updatedColumns });
  },

  updateItem(itemId: string, updates: Partial<IdeaItem>) {
    const storage = loadFromStorage();
    const updatedColumns = storage.columns.map(col => ({
      ...col,
      items: col.items.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    }));

    saveToStorage({ ...storage, columns: updatedColumns });
  },

  deleteItem(itemId: string) {
    const storage = loadFromStorage();
    const updatedColumns = storage.columns.map(col => ({
      ...col,
      items: col.items.filter(item => item.id !== itemId)
    }));

    saveToStorage({ ...storage, columns: updatedColumns });
  }
};