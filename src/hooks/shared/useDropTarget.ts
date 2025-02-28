import { useCallback } from 'react';
import { useDragState } from './useDragState';
import { useDragPosition } from './useDragPosition';
import { logger } from '../../utils/logger';
import type { DragPayload, DragMetadata } from '../../types/dragTypes';

interface DropTargetOptions {
  id: string;
  type: 'quadrant' | 'track' | 'act' | 'prompt-section';
  view: 'workshop' | 'timeline' | 'episodes' | 'prompts';
  onDrop?: (data: DragPayload, metadata: DragMetadata) => void;
}

export function useDropTarget({ id, type, view, onDrop }: DropTargetOptions) {
  const { getDragData } = useDragState();
  const { calculatePosition } = useDragPosition();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-gray-100/50', 'border-2', 'border-dashed', 'border-black/30');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-gray-100/50', 'border-2', 'border-dashed', 'border-black/30');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-100/50', 'border-2', 'border-dashed', 'border-black/30');

    try {
      const payload = getDragData(e);
      if (!payload) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const { index } = calculatePosition(e, rect);

      // Create new metadata for the drop target
      const dropMetadata: DragMetadata = {
        sourceView: view,
        sourceContainer: {
          type,
          id
        },
        position: {
          index,
          parentId: id
        }
      };

      logger.debug('Drop processed:', { payload, dropMetadata });
      onDrop?.(payload, dropMetadata);
    } catch (error) {
      logger.error('Drop failed:', error);
    }
  }, [id, type, view, onDrop, getDragData, calculatePosition]);

  return {
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
}