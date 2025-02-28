import { useDragDrop } from '../shared/useDragDrop';
import type { Scene } from '../../types/episode';

interface SceneDragItem {
  id: number;
  type: 'scene';
  sourceId: string;
  sourceType: 'act';
  data: {
    title: string;
    content: string;
    episodeId: number;
  };
}

export function useSceneDragDrop(episodeId: number, actId: string) {
  return useDragDrop<SceneDragItem>({
    itemType: 'scene',
    sourceId: actId,
    sourceType: 'act',
    onDrop: (item, targetActId) => {
      // Handle scene drop logic here
      console.log('Scene dropped', { item, targetActId });
    }
  });
}