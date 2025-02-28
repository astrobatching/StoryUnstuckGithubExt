import React from 'react';
import type { Act, Beat } from '../../types/episode';
import { cn } from '../../lib/utils';

type ActSectionProps = {
  act: Act;
  onBeatClick: (beatId: string) => void;
};

const BeatCard: React.FC<{ beat: Beat }> = ({ beat }) => {
  const colors = {
    hook: 'bg-red-100',
    progressive: 'bg-blue-100',
    'turning-point': 'bg-green-100',
    climax: 'bg-purple-100',
    resolution: 'bg-gray-100',
  };

  return (
    <div
      className={cn(
        'p-4 border-4 border-black mb-2 cursor-move',
        colors[beat.type]
      )}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold">{beat.title}</h4>
        <span className="text-sm text-gray-600">{beat.duration}min</span>
      </div>
      <p className="text-sm text-gray-600">{beat.description}</p>
    </div>
  );
};

export const ActSection: React.FC<ActSectionProps> = ({ act, onBeatClick }) => {
  return (
    <div className="flex-1 border-4 border-black bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">{act.title}</h3>
        <button className="text-sm border-2 border-black px-2 py-1 hover:bg-gray-100">
          Add Beat
        </button>
      </div>
      <div className="space-y-2">
        {act.beats.map(beat => (
          <div key={beat.id} onClick={() => onBeatClick(beat.id)}>
            <BeatCard beat={beat} />
          </div>
        ))}
      </div>
    </div>
  );
};