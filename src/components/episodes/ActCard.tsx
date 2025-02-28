import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../ui/button';
import { SceneCard } from './SceneCard';
import { cn } from '../../lib/utils';
import type { Scene } from '../../types/episode';

interface ActCardProps {
  id: string;
  title: string;
  color: string;
  scenes?: Scene[];
  onAddScene: () => void;
  onUpdateScene: (id: number, updates: Partial<Scene>) => void;
  onDeleteScene: (id: number) => void;
}

export const ActCard: React.FC<ActCardProps> = ({
  id,
  title,
  color,
  scenes = [],
  onAddScene,
  onUpdateScene,
  onDeleteScene
}) => {
  return (
    <div className="border-4 border-black">
      <div className={cn(
        'flex items-center justify-between px-2 py-1', // Reduced padding
        color,
        'border-b-4 border-black'
      )}>
        <h3 className="font-mono text-xs font-bold text-white truncate">{title}</h3>
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={onAddScene}
            className="h-5 w-5 p-0 hover:bg-white/10 text-white" // Reduced size
          >
            <Plus className="h-3 w-3" /> {/* Smaller icon */}
          </Button>
          <Button
            variant="ghost"
            className="h-5 w-5 p-0 hover:bg-white/10 text-white" // Reduced size
          >
            <X className="h-3 w-3" /> {/* Smaller icon */}
          </Button>
        </div>
      </div>
      
      <div className="p-2 space-y-2">
        {Array.isArray(scenes) && scenes.map(scene => (
          <SceneCard
            key={scene.id}
            scene={scene}
            onUpdate={(updates) => onUpdateScene(scene.id, updates)}
            onDelete={() => onDeleteScene(scene.id)}
          />
        ))}
      </div>
    </div>
  );
};