import React from 'react';
import { useIdeaPileState } from '../../hooks/ideapile/useIdeaPileState';
import { IdeaPileLayout } from '../ideapile/IdeaPileLayout';
import { IdeaPileHeader } from '../ideapile/header/IdeaPileHeader';
import { IdeaPileColumns } from '../ideapile/columns/IdeaPileColumns';
import type { ViewType } from '../../constants/navigation';

interface IdeaPileViewProps {
  onNavigate: (view: ViewType) => void;
}

export const IdeaPileView: React.FC<IdeaPileViewProps> = ({ onNavigate }) => {
  const {
    viewMode,
    setViewMode,
    columns,
    addItem
  } = useIdeaPileState();

  const handleAddItem = (columnId: string) => {
    const title = prompt('Enter idea title:');
    if (title) {
      addItem(columnId, {
        title,
        content: '',
        type: 'note',
        columnId,
        tags: []
      });
    }
  };

  return (
    <IdeaPileLayout onNavigate={onNavigate}>
      <IdeaPileHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddItem={() => handleAddItem('inbox')}
      />
      <IdeaPileColumns
        columns={columns}
        viewMode={viewMode}
        onAddItem={handleAddItem}
      />
    </IdeaPileLayout>
  );
};