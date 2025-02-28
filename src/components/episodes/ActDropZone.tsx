import React, { useRef } from 'react';
import { useDropTarget } from '../../hooks/episodes/useDropTarget';
import { useSceneOrder } from '../../hooks/episodes/useSceneOrder';
import { cn } from '../../lib/utils';
import { logger } from '../../utils/logger';
import type { Scene } from '../../types/episode';

interface ActDropZoneProps {
  actId: string;
  scenes: Scene[];
  onSceneDrop: (sceneData: Scene, targetIndex: number) => void;
  onScenesReorder: (scenes: Scene[]) => void;
  children: React.ReactNode;
}

export const ActDropZone = React.forwardRef<HTMLDivElement, ActDropZoneProps>(({
  actId,
  scenes,
  onSceneDrop,
  onScenesReorder,
  children
}, ref) => {
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const { isOver, handleDragOver, handleDragLeave, setIsOver } = useDropTarget();
  const { reorderScenes, calculateDropIndex } = useSceneOrder(actId);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);

    if (!dropZoneRef.current) return;

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type !== 'scene') return;

      const targetIndex = calculateDropIndex(e, dropZoneRef.current.getBoundingClientRect());
      logger.debug('Drop target calculated:', { targetIndex, data });

      if (data.actId !== actId) {
        onSceneDrop(data.scene, targetIndex);
      } else {
        const newScenes = reorderScenes(data.index, targetIndex, scenes);
        onScenesReorder(newScenes);
      }
    } catch (error) {
      logger.error('Drop handling failed:', error);
    }
  };

  return (
    <div
      ref={dropZoneRef}
      className={cn(
        "flex-1 p-4 space-y-3 min-h-[100px]",
        "transition-all duration-200",
        isOver && "bg-gray-100/50 border-2 border-dashed border-black/30"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
});

ActDropZone.displayName = 'ActDropZone';