import React from 'react';
import { Button } from '../../../ui/button';
import { cn } from '../../../../lib/utils';

interface EmotionalArcProps {
  start: string;
  end: string;
  progress: number;
  isPositive: boolean;
  onUpdate: (updates: {
    emotionalStart?: string;
    emotionalEnd?: string;
    emotionalProgress?: number;
    isPositiveArc?: boolean;
  }) => void;
}

const DEFAULT_START = 'Neutral';
const DEFAULT_END = 'Neutral';
const DEFAULT_PROGRESS = 50;

export const EmotionalArc: React.FC<EmotionalArcProps> = ({
  start = DEFAULT_START,
  end = DEFAULT_END,
  progress = DEFAULT_PROGRESS,
  isPositive = true,
  onUpdate
}) => {
  // Ensure controlled inputs always have valid values
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ emotionalStart: e.target.value || DEFAULT_START });
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ emotionalEnd: e.target.value || DEFAULT_END });
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onUpdate({ emotionalProgress: isNaN(value) ? DEFAULT_PROGRESS : value });
  };

  return (
    <div className="border-b-4 border-black p-4">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={start}
          onChange={handleStartChange}
          className="font-mono text-sm text-gray-600 w-32 p-1 border-2 border-black rounded"
          placeholder={DEFAULT_START}
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdate({ isPositiveArc: !isPositive })}
            className={cn(
              'px-3 py-1 font-mono text-sm border-2 border-black transition-colors',
              isPositive ? 'bg-green-200' : 'bg-red-200'
            )}
          >
            {isPositive ? 'POSITIVE' : 'NEGATIVE'}
          </button>
        </div>
        <input
          type="text"
          value={end}
          onChange={handleEndChange}
          className="font-mono text-sm text-gray-600 w-32 p-1 border-2 border-black rounded"
          placeholder={DEFAULT_END}
        />
      </div>
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className={cn(
            "w-full h-2 bg-gray-200 rounded-full appearance-none",
            "[&::-webkit-slider-thumb]:appearance-none",
            "[&::-webkit-slider-thumb]:w-4",
            "[&::-webkit-slider-thumb]:h-4",
            "[&::-webkit-slider-thumb]:rounded-full",
            "[&::-webkit-slider-thumb]:bg-black",
            "[&::-webkit-slider-thumb]:cursor-pointer"
          )}
        />
        <div 
          className="absolute top-0 left-0 h-2 rounded-full transition-all"
          style={{
            width: `${progress}%`,
            background: isPositive ? 
              'linear-gradient(to right, #f87171, #4ade80)' : 
              'linear-gradient(to right, #f87171, #d1d5db)'
          }}
        />
      </div>
    </div>
  );
};