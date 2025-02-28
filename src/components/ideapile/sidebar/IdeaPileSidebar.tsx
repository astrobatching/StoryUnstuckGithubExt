import React from 'react';
import { Search, Tag, Filter } from 'lucide-react';
import { Button } from '../../ui/button';
import { QUICK_TAGS } from '../../../constants/ideapile';
import type { IdeaPileState } from '../../../types/ideapile';

interface IdeaPileSidebarProps {
  filters: IdeaPileState['filters'];
  onUpdateFilters: (filters: Partial<IdeaPileState['filters']>) => void;
}

export function IdeaPileSidebar({ filters, onUpdateFilters }: IdeaPileSidebarProps) {
  return (
    <div className="w-64 border-r-4 border-black bg-white flex flex-col">
      {/* Search */}
      <div className="p-4 border-b-4 border-black">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onUpdateFilters({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border-2 border-black text-sm"
            placeholder="Search ideas..."
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div className="p-4 border-b-4 border-black">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Quick Filters
        </h3>
        <div className="space-y-4">
          {Object.entries(QUICK_TAGS).map(([category, tags]) => (
            <div key={category}>
              <h4 className="text-sm font-medium mb-2 capitalize">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Button
                    key={tag}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const currentTags = filters.tags || [];
                      const newTags = currentTags.includes(tag)
                        ? currentTags.filter(t => t !== tag)
                        : [...currentTags, tag];
                      onUpdateFilters({ tags: newTags });
                    }}
                    className={`px-3 py-1 border-2 border-black text-xs ${
                      filters.tags?.includes(tag) ? 'bg-black text-white' : ''
                    }`}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Tags */}
      <div className="p-4 border-b-4 border-black">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Custom Tags
        </h3>
        <Button
          variant="ghost"
          className="w-full border-2 border-black border-dashed"
          onClick={() => {
            const tag = prompt('Enter new tag:');
            if (tag?.trim()) {
              const newTag = tag.startsWith('#') ? tag : `#${tag}`;
              const currentTags = filters.tags || [];
              onUpdateFilters({ tags: [...currentTags, newTag] });
            }
          }}
        >
          Add Tag
        </Button>
      </div>
    </div>
  );
}