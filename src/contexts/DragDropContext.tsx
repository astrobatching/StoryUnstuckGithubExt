```typescript
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { logger } from '../utils/logger';

// Core types
export interface DragItem {
  id: string;
  type: 'scene' | 'story';
  sourceId: string;
  index: number;
}

export interface DragState {
  active: boolean;
  item: DragItem | null;
  target: {
    id: string;
    index: number;
  } | null;
  position: 'before' | 'after' | null;
}

// Action types
type DragAction = 
  | { type: 'START_DRAG'; payload: DragItem }
  | { type: 'UPDATE_TARGET'; payload: { id: string; index: number } }
  | { type: 'SET_POSITION'; payload: 'before' | 'after' | null }
  | { type: 'END_DRAG' }
  | { type: 'RESET' };

const initialState: DragState = {
  active: false,
  item: null,
  target: null,
  position: null
};

// Context setup
const DragDropContext = createContext<{
  state: DragState;
  dispatch: React.Dispatch<DragAction>;
} | null>(null);

// Reducer
function dragReducer(state: DragState, action: DragAction): DragState {
  switch (action.type) {
    case 'START_DRAG':
      return {
        ...state,
        active: true,
        item: action.payload
      };
      
    case 'UPDATE_TARGET':
      return {
        ...state,
        target: action.payload
      };
      
    case 'SET_POSITION':
      return {
        ...state,
        position: action.payload
      };
      
    case 'END_DRAG':
    case 'RESET':
      return initialState;
      
    default:
      return state;
  }
}

// Provider component
export function DragDropProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dragReducer, initialState);

  logger.debug('DragDrop state updated:', state);

  return (
    <DragDropContext.Provider value={{ state, dispatch }}>
      {children}
    </DragDropContext.Provider>
  );
}

// Hook for consuming context
export function useDragDrop() {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within DragDropProvider');
  }
  return context;
}
```