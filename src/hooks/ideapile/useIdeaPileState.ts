import { useState, useCallback } from 'react';
import type { IdeaItem, IdeaPileState, ViewMode, ItemStatus } from '../../types/ideapile';

const STORAGE_KEY = 'idea_pile_data';

export function useIdeaPileState() {
  const [state, setState] = useState<IdeaPileState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {
        items: [],
        viewMode: 'grid',
        filters: {},
        sort: { field: 'createdAt', direction: 'desc' }
      };
    } catch {
      return {
        items: [],
        viewMode: 'grid',
        filters: {},
        sort: { field: 'createdAt', direction: 'desc' }
      };
    }
  });

  const saveState = useCallback((newState: IdeaPileState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error('Failed to save idea pile state:', error);
    }
  }, []);

  const addItem = useCallback((item: Omit<IdeaItem, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'projectRefs'>) => {
    setState(prev => {
      const newItem: IdeaItem = {
        ...item,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'unprocessed',
        projectRefs: [],
        tags: [...item.tags]
      };
      const newState = {
        ...prev,
        items: [newItem, ...prev.items]
      };
      saveState(newState);
      return newState;
    });
  }, [saveState]);

  const updateItem = useCallback((id: string, updates: Partial<IdeaItem>) => {
    setState(prev => {
      const newState = {
        ...prev,
        items: prev.items.map(item =>
          item.id === id
            ? { ...item, ...updates, updatedAt: new Date() }
            : item
        )
      };
      saveState(newState);
      return newState;
    });
  }, [saveState]);

  const deleteItem = useCallback((id: string) => {
    setState(prev => {
      const newState = {
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      };
      saveState(newState);
      return newState;
    });
  }, [saveState]);

  const assignToProject = useCallback((itemId: string, projectId: string, projectName: string, usage: string) => {
    setState(prev => {
      const newState = {
        ...prev,
        items: prev.items.map(item =>
          item.id === itemId
            ? {
                ...item,
                status: 'inuse' as ItemStatus,
                projectRefs: [
                  ...item.projectRefs,
                  {
                    projectId,
                    projectName,
                    usage,
                    dateUsed: new Date()
                  }
                ]
              }
            : item
        )
      };
      saveState(newState);
      return newState;
    });
  }, [saveState]);

  const addTag = useCallback((itemId: string, tag: string) => {
    setState(prev => {
      const newState = {
        ...prev,
        items: prev.items.map(item =>
          item.id === itemId && !item.tags.includes(tag)
            ? { ...item, tags: [...item.tags, tag] }
            : item
        )
      };
      saveState(newState);
      return newState;
    });
  }, [saveState]);

  const removeTag = useCallback((itemId: string, tag: string) => {
    setState(prev => {
      const newState = {
        ...prev,
        items: prev.items.map(item =>
          item.id === itemId
            ? { ...item, tags: item.tags.filter(t => t !== tag) }
            : item
        )
      };
      saveState(newState);
      return newState;
    });
  }, [saveState]);

  const setViewMode = useCallback((mode: ViewMode) => {
    setState(prev => {
      const newState = { ...prev, viewMode: mode };
      saveState(newState);
      return newState;
    });
  }, [saveState]);

  const updateFilters = useCallback((filters: Partial<IdeaPileState['filters']>) => {
    setState(prev => {
      const newState = {
        ...prev,
        filters: { ...prev.filters, ...filters }
      };
      saveState(newState);
      return newState;
    });
  }, [saveState]);

  const updateSort = useCallback((sort: IdeaPileState['sort']) => {
    setState(prev => {
      const newState = { ...prev, sort };
      saveState(newState);
      return newState;
    });
  }, [saveState]);

  return {
    state,
    addItem,
    updateItem,
    deleteItem,
    assignToProject,
    addTag,
    removeTag,
    setViewMode,
    updateFilters,
    updateSort
  };
}