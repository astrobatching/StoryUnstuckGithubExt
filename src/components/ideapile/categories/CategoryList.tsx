import React from 'react';
import { Folder, Hash } from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';

interface Category {
  id: string;
  name: string;
  count: number;
}

const defaultCategories: Category[] = [
  { id: 'all', name: 'All Ideas', count: 12 },
  { id: 'untagged', name: 'Untagged', count: 3 },
  { id: 'archived', name: 'Archived', count: 5 }
];

export const CategoryList: React.FC = () => {
  const [selectedId, setSelectedId] = React.useState('all');

  return (
    <div className="space-y-4">
      {/* Main Categories */}
      <div className="space-y-1">
        {defaultCategories.map(category => (
          <Button
            key={category.id}
            variant="ghost"
            className={cn(
              'w-full justify-start font-medium',
              selectedId === category.id && 'bg-gray-100'
            )}
            onClick={() => setSelectedId(category.id)}
          >
            <Folder className="h-4 w-4 mr-2" />
            <span className="flex-1 text-left">{category.name}</span>
            <span className="text-xs text-gray-500">{category.count}</span>
          </Button>
        ))}
      </div>

      {/* Tags */}
      <div>
        <h3 className="font-medium text-sm mb-2">Tags</h3>
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-sm"
          >
            <Hash className="h-3 w-3 mr-2" />
            research
            <span className="ml-auto text-xs text-gray-500">8</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm"
          >
            <Hash className="h-3 w-3 mr-2" />
            inspiration
            <span className="ml-auto text-xs text-gray-500">5</span>
          </Button>
        </div>
      </div>
    </div>
  );
};