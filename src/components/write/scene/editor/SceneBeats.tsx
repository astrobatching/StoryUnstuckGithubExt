import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../../../ui/button';
import { cn } from '../../../../lib/utils';
import type { SceneBeat } from '../../../../types/write';

interface SceneBeatsProps {
  beats: SceneBeat[];
  onUpdate: (beats: SceneBeat[]) => void;
}

const DEFAULT_BEATS: SceneBeat[] = [
  { id: '1', title: 'SETUP', notes: '', color: 'bg-blue-500' },
  { id: '2', title: 'CONFLICT', notes: '', color: 'bg-red-500' },
  { id: '3', title: 'ESCALATION', notes: '', color: 'bg-yellow-500' },
  { id: '4', title: 'CLIMAX', notes: '', color: 'bg-purple-500' },
  { id: '5', title: 'RESOLUTION', notes: '', color: 'bg-green-500' }
];

export const SceneBeats: React.FC<SceneBeatsProps> = ({
  beats = DEFAULT_BEATS, // Add default beats
  onUpdate
}) => {
  const handleBeatUpdate = (id: string, notes: string) => {
    onUpdate(
      beats.map(beat =>
        beat.id === id ? { ...beat, notes } : beat
      )
    );
  };

  const addBeat = () => {
    const title = prompt('Enter beat title:');
    if (title) {
      onUpdate([
        ...beats,
        {
          id: Date.now().toString(),
          title,
          notes: '',
          color: 'bg-gray-500'
        }
      ]);
    }
  };

  const removeBeat = (id: string) => {
    onUpdate(beats.filter(beat => beat.id !== id));
  };

  return (
    <div className="p-4 flex-1">
      <div className="grid grid-cols-5 gap-4">
        {beats.map(beat => (
          <div key={beat.id} className="flex flex-col h-full">
            <div className="flex items-center gap-1 mb-2">
              <div className={cn(
                beat.color,
                'flex-1 p-2 border-2 border-black font-mono text-sm text-center'
              )}>
                {beat.title}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeBeat(beat.id)}
                className="h-6 w-6 p-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <textarea
              className="flex-1 p-2 border-2 border-black font-mono text-sm resize-none min-h-[120px]"
              value={beat.notes}
              onChange={(e) => handleBeatUpdate(beat.id, e.target.value)}
              placeholder="Beat notes..."
            />
          </div>
        ))}
        <Button
          variant="ghost"
          onClick={addBeat}
          className="h-8 border-2 border-black"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};