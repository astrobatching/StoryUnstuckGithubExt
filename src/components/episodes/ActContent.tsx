import React from 'react';
import { SceneCard } from './cards/SceneCard';
import { cn } from '../../lib/utils';
import type { Scene } from '../../types/episode';

interface ActContentProps {
  actId: string;
  episodeId: number;
  scenes: Scene[];
  onUpdateScene: (id: number, updates: Partial<Scene>) => void;
  onDeleteScene: (id: number) => void;
  onMoveScene: (sceneId: number, targetActId: string) => void;
}

export const ActContent: React.FC<ActContentProps> = ({
  actId,
  scenes,
  onUpdateScene,
  onDeleteScene,
  onMoveScene
}) => {
  return (
    <div 
      className={cn(
        "flex-1 p-4 space-y-3 transition-all duration-200",
        "min-h-[100px]",
        "overflow-y-auto"
      )}
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes('application/json')) {
          e.preventDefault();
          e.currentTarget.classList.add('bg-gray-100/50', 'border-2', 'border-dashed', 'border-black/30');
        }
      }}
      onDragLeave={(e) => {
        e.currentTarget.classList.remove('bg-gray-100/50', 'border-2', 'border-dashed', 'border-black/30');
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-gray-100/50', 'border-2', 'border-dashed', 'border-black/30');
        
        try {
          const data = JSON.parse(e.dataTransfer.getData('application/json'));
          if (data.type === 'scene' && data.actId !== actId) {
            onMoveScene(data.id, actId);
          }
        } catch (error) {
          console.error('Failed to process drop:', error);
        }
      }}
    >
      {scenes.map((scene) => (
        <SceneCard
          key={scene.id}
          scene={scene}
          onUpdate={onUpdateScene}
          onDelete={onDeleteScene}
        />
      ))}
    </div>
  );
};