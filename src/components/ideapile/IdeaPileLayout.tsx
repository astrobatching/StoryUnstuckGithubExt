import React from 'react';
import { IdeaPileHeader } from './header/IdeaPileHeader';
import { IdeaPileColumns } from './columns/IdeaPileColumns';
import { IdeaPileSidebar } from './sidebar/IdeaPileSidebar';
import { useIdeaPileState } from '../../hooks/ideapile/useIdeaPileState';
import { DEFAULT_COLUMNS } from '../../constants/ideapile';

export function IdeaPileLayout() {
  const {
    state,
    addItem,
    updateItem,
    deleteItem,
    assignToProject,
    addTag,
    removeTag,
    setViewMode,
    updateFilters,
    updateSort
  } = useIdeaPileState();

  // Group items by column
  const columnItems = DEFAULT_COLUMNS.map(column => ({
    ...column,
    items: state.items.filter(item => {
      // Apply filters
      if (state.filters.category && item.category !== state.filters.category) return false;
      if (state.filters.status && item.status !== state.filters.status) return false;
      if (state.filters.tags?.length && !state.filters.tags.every(tag => item.tags.includes(tag))) return false;
      if (state.filters.search) {
        const search = state.filters.search.toLowerCase();
        return (
          item.title.toLowerCase().includes(search) ||
          item.content.toLowerCase().includes(search) ||
          item.tags.some(tag => tag.toLowerCase().includes(search))
        );
      }
      
      // Determine column based on status and category
      switch (column.id) {
        case 'inbox':
          return item.status === 'unprocessed';
        case 'active':
          return item.status === 'inuse';
        case 'reference':
          return item.category === 'reference';
        case 'archive':
          return item.status === 'archived';
        default:
          return false;
      }
    })
  }));

  return (
    <div className="h-screen flex bg-gray-100">
      <IdeaPileSidebar
        filters={state.filters}
        onUpdateFilters={updateFilters}
      />

      <div className="flex-1 flex flex-col">
        <IdeaPileHeader
          viewMode={state.viewMode}
          onViewModeChange={setViewMode}
          sort={state.sort}
          onUpdateSort={updateSort}
          onQuickCapture={() => {
            addItem({
              title: 'Quick Capture',
              content: '',
              type: 'note',
              category: 'capture',
              tags: ['#unprocessed']
            });
          }}
        />

        <div className="flex-1 overflow-hidden">
          <IdeaPileColumns
            columns={columnItems}
            viewMode={state.viewMode}
            onUpdateItem={updateItem}
            onDeleteItem={deleteItem}
            onAssignToProject={assignToProject}
            onAddTag={addTag}
            onRemoveTag={removeTag}
          />
        </div>
      </div>
    </div>
  );
}