import React from 'react';
import { Grid, List, Plus, ArrowUpDown } from 'lucide-react';
import { Button } from '../../ui/button';
import { SORT_OPTIONS } from '../../../constants/ideapile';
import type { ViewMode, IdeaPileState } from '../../../types/ideapile';

interface IdeaPileHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sort: IdeaPileState['sort'];
  onUpdateSort: (sort: IdeaPileState['sort']) => void;
  onQuickCapture: () => void;
}

export function IdeaPileHeader({
  viewMode,
  onViewModeChange,
  sort,
  onUpdateSort,
  onQuickCapture
}: IdeaPileHeaderProps) {
  return (
    <div className="border-b-4 border-black bg-white p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Idea Pile</h1>
        
        <div className="flex items-center gap-4">
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
            <select
              value={sort.field}
              onChange={(e) => onUpdateSort({
                field: e.target.value as IdeaPileState['sort']['field'],
                direction: sort.direction
              })}
              className="border-2 border-black p-1 text-sm"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdateSort({
                ...sort,
                direction: sort.direction === 'asc' ? 'desc' : 'asc'
              })}
              className="border-2 border-black"
            >
              {sort.direction === 'asc' ? '↑' : '↓'}
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex border-2 border-black rounded">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange('list')}
              className={`h-8 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className={`h-8 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Quick Capture */}
          <Button 
            className="border-2 border-black"
            onClick={onQuickCapture}
          >
            <Plus className="h-4 w-4 mr-2" />
            Quick Capture
          </Button>
        </div>
      </div>
    </div>
  );
}