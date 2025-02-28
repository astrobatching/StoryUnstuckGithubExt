```typescript
import { useCallback } from 'react';
import { logger } from '../utils/logger';
import type { DragItem } from '../contexts/DragDropContext';

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function useDropValidation() {
  const validateDrop = useCallback((source: DragItem, targetId: string): ValidationResult => {
    // Prevent dropping on self
    if (source.id === targetId) {
      return { isValid: false, error: 'Cannot drop item on itself' };
    }

    // Prevent dropping in same position
    if (source.sourceId === targetId && source.index === source.index) {
      return { isValid: false, error: 'Item already in target position' };
    }

    // Validate type compatibility
    if (source.type === 'scene') {
      // Scenes can only be dropped in acts
      if (!targetId.startsWith('act_')) {
        return { isValid: false, error: 'Scenes can only be moved between acts' };
      }
    }

    logger.debug('Drop validation passed:', { source, targetId });
    return { isValid: true };
  }, []);

  return { validateDrop };
}
```