import { useState, useCallback } from 'react';
import { logger } from '../../utils/logger';
import type { Scene } from '../../types/episode';

export function useSceneOrder(actId: string) {
  const [sceneOrder, setSceneOrder] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`scene_order_${actId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const reorderScenes = useCallback((sourceIndex: number, targetIndex: number, scenes: Scene[]): Scene[] => {
    const newScenes = [...scenes];
    const [moved] = newScenes.splice(sourceIndex, 1);
    newScenes.splice(targetIndex, 0, moved);
    
    const newOrder = newScenes.map(scene => scene.id.toString());
    setSceneOrder(newOrder);
    
    try {
      localStorage.setItem(`scene_order_${actId}`, JSON.stringify(newOrder));
      logger.debug('Scene order updated:', { sourceIndex, targetIndex, newOrder });
    } catch (error) {
      logger.error('Failed to save scene order:', error);
    }
    
    return newScenes;
  }, [actId]);

  const calculateDropIndex = useCallback((e: React.DragEvent, containerRect: DOMRect): number => {
    const mouseY = e.clientY - containerRect.top;
    const totalHeight = containerRect.height;
    const position = mouseY / totalHeight;
    return Math.floor(position * sceneOrder.length);
  }, [sceneOrder.length]);

  return {
    sceneOrder,
    reorderScenes,
    calculateDropIndex
  };
}