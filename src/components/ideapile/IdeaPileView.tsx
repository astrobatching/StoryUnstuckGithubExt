import React from 'react';
import { useIdeaPileState } from '../../hooks/ideapile/useIdeaPileState';
import { IdeaPileHeader } from './header/IdeaPileHeader';
import { IdeaPileGrid } from './grid/IdeaPileGrid';
import { IdeaPileList } from './list/IdeaPileList';
import { IdeaPileSidebar } from './sidebar/IdeaPileSidebar';
import { cn } from '../../lib/utils';

export const IdeaPileView: React.FC = () => {
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

  const handleQuickCapture = () => {
    addItem({
      title: 'Quick Capture',
      content: '',
      type: 'note',
      category: 'capture',
      tags: ['#unprocessed']
    });
  };

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
          onQuickCapture={handleQuickCapture}
          sort={state.sort}
          onUpdateSort={updateSort}
        />

        <div className="flex-1 p-6 overflow-y-auto">
          {state.viewMode === 'grid' ? (
            <IdeaPileGrid
              items={state.items}
              onUpdateItem={updateItem}
              onDeleteItem={deleteItem}
              onAssignToProject={assignToProject}
              onAddTag={addTag}
              onRemoveTag={removeTag}
            />
          ) : (
            <IdeaPileList
              items={state.items}
              onUpdateItem={updateItem}
              onDeleteItem={deleteItem}
              onAssignToProject={assignToProject}
              onAddTag={addTag}
              onRemoveTag={removeTag}
            />
          )}
        </div>
      </div>
    </div>
  );
};