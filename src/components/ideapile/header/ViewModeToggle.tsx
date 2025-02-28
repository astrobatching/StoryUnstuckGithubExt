import React from 'react';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { Button } from '../../ui/button';
import type { ViewMode } from '../../../types/ideapile';

interface ViewModeToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  mode,
  onChange
}) => {
  return (
    <div className="flex items-center gap-2 border-2 border-black rounded-md">
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 ${mode === 'list' ? 'bg-gray-100' : ''}`}
        onClick={() => onChange('list')}
      >
        <LayoutList className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 ${mode === 'grid' ? 'bg-gray-100' : ''}`}
        onClick={() => onChange('grid')}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  );
};