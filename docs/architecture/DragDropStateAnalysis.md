# Drag and Drop State Management Analysis

## 1. State Flow Analysis

### Initial State Structure
```typescript
// Current fragmented state across multiple components
interface DragState {
  // Workshop View
  stories: {
    byId: Record<string, Story>;
    byQuadrant: Record<string, string[]>;
  };

  // Episode View
  scenes: {
    byId: Record<string, Scene>;
    byAct: Record<string, string[]>;
  };

  // Shared State
  dragOperation: {
    active: boolean;
    sourceId: string | null;
    targetId: string | null;
    itemType: 'scene' | 'story' | null;
    position: 'before' | 'after' | null;
  };
}
```

### State Transition Issues
1. **Inconsistent State Updates**
   - Multiple components updating drag state independently
   - No centralized state transition management
   - Race conditions during rapid drag operations

2. **Missing Intermediate States**
   - Drag hover states not properly tracked
   - Drop zone activation states unreliable
   - Position indicators inconsistent

3. **State Sync Problems**
   - Workshop and Episode views can get out of sync
   - Dropped items sometimes appear in both source and target
   - State updates don't always propagate correctly

## 2. Component Interaction Map

### Workshop View
```typescript
// Current flow:
WorkshopView
  └─ QuadrantColumn
      └─ StoryCard
          └─ Local drag state
          └─ Independent drop handling
```

### Episode View
```typescript
// Current flow:
EpisodeView
  └─ ActCard
      └─ SceneCard
          └─ Local drag state
          └─ Duplicate drop logic
```

### State Sharing Issues
1. No unified drag context
2. Redundant state tracking
3. Inconsistent event handling

## 3. Specific Problem Areas

### State Inconsistencies
1. **Scene Position Tracking**
   ```typescript
   // Current problematic implementation
   const handleDrop = (e: React.DragEvent) => {
     const data = JSON.parse(e.dataTransfer.getData('application/json'));
     // Direct state mutation without validation
     setScenes(prev => [...prev, data]); // Can cause duplicates
   };
   ```

2. **Story Card Management**
   ```typescript
   // Missing cleanup
   const handleDragEnd = () => {
     setIsDragging(false);
     // Should also reset other state
   };
   ```

### Performance Bottlenecks
1. Excessive re-renders during drag
2. Inefficient state updates
3. Redundant position calculations

### Edge Cases
1. Drag cancellation handling
2. Multi-item drag operations
3. Nested droppable areas

## 4. Recommendations

### 1. Unified Drag Context
```typescript
// Create centralized drag context
interface DragDropContext {
  active: boolean;
  source: {
    id: string;
    type: 'scene' | 'story';
    index: number;
  } | null;
  target: {
    id: string;
    type: 'scene' | 'story';
    index: number;
  } | null;
  position: 'before' | 'after' | null;
}

// Implement provider
const DragDropProvider: React.FC = ({ children }) => {
  const [dragState, dispatch] = useReducer(dragReducer, initialState);
  
  return (
    <DragDropContext.Provider value={{ state: dragState, dispatch }}>
      {children}
    </DragDropContext.Provider>
  );
};
```

### 2. State Management Improvements
```typescript
// Create focused hooks
export function useDragOperation() {
  const { state, dispatch } = useDragDropContext();
  
  const startDrag = useCallback((source: DragSource) => {
    dispatch({ type: 'START_DRAG', payload: source });
  }, [dispatch]);
  
  const updateDragPosition = useCallback((target: DragTarget) => {
    dispatch({ type: 'UPDATE_POSITION', payload: target });
  }, [dispatch]);
  
  const endDrag = useCallback((result: DropResult) => {
    dispatch({ type: 'END_DRAG', payload: result });
  }, [dispatch]);

  return { startDrag, updateDragPosition, endDrag };
}
```

### 3. Optimization Priorities

1. **Immediate Fixes**
   - Implement unified drag context
   - Add proper cleanup on drag end
   - Fix position calculation logic

2. **Short-term Improvements**
   - Add drag operation validation
   - Implement proper error boundaries
   - Add state persistence for long operations

3. **Long-term Optimizations**
   - Virtual scrolling for large lists
   - Batch state updates
   - Add drag preview optimization

### 4. Implementation Plan

1. **Phase 1: State Consolidation**
   ```typescript
   // Create central state store
   export const dragStore = createStore({
     active: false,
     source: null,
     target: null,
     position: null,
     
     reducers: {
       startDrag: (state, action) => {},
       updateDrag: (state, action) => {},
       endDrag: (state, action) => {},
     },
     
     middleware: [
       validateDragOperation,
       trackDragMetrics,
       persistDragState
     ]
   });
   ```

2. **Phase 2: Component Updates**
   - Update all drag components to use central store
   - Implement proper error boundaries
   - Add validation and cleanup

3. **Phase 3: Optimization**
   - Add performance monitoring
   - Implement batched updates
   - Add drag preview caching

## 5. Investigation Points

1. **State Consistency**
   - Monitor state during rapid drag operations
   - Track cleanup after cancelled operations
   - Verify position calculations

2. **Performance**
   - Profile render cycles during drag
   - Measure state update frequency
   - Check memory usage patterns

3. **Error Handling**
   - Test error boundary effectiveness
   - Verify cleanup after errors
   - Monitor error recovery

## 6. Testing Strategy

```typescript
// Add comprehensive tests
describe('DragDropContext', () => {
  it('maintains consistent state during drag operations', () => {
    const { result } = renderHook(() => useDragOperation());
    
    act(() => {
      result.current.startDrag(sourceMock);
    });
    
    expect(result.current.state.active).toBe(true);
    expect(result.current.state.source).toEqual(sourceMock);
  });
  
  it('handles edge cases properly', () => {
    // Test cancelled operations
    // Test invalid drops
    // Test rapid operations
  });
});
```