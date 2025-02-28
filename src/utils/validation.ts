import type { Scene } from '../types/episode';

export function isValidSceneData(data: unknown): data is Scene {
  if (!data || typeof data !== 'object') return false;
  
  const scene = data as Partial<Scene>;
  
  return (
    typeof scene.id === 'number' &&
    typeof scene.title === 'string' &&
    typeof scene.content === 'string' &&
    typeof scene.actId === 'string' &&
    typeof scene.episodeId === 'number'
  );
}

export function validateDragData(data: unknown): boolean {
  try {
    if (!data || typeof data !== 'object') return false;
    
    const dragData = data as Record<string, unknown>;
    
    return (
      typeof dragData.type === 'string' &&
      typeof dragData.id === 'string' &&
      typeof dragData.sourceId === 'string'
    );
  } catch {
    return false;
  }
}