import React from 'react';
import { MainNavigation } from '../layout/MainNavigation';
import { WorkshopView } from '../workshop/WorkshopView';
import { EpisodesView } from '../episodes/EpisodesView';
import { WriteView } from '../views/WriteView';
import { PromptsView } from '../views/PromptsView';
import { TaskView } from '../views/TaskView';
import { IdeaPileView } from '../views/IdeaPileView';
import { ChatWindow } from '../chat/ChatWindow';
import type { ViewType } from '../../constants/navigation';

interface ClassicTemplateProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  onHomeClick: () => void;
  onTemplateChange: () => void;
}

export const ClassicTemplate: React.FC<ClassicTemplateProps> = ({
  activeView,
  onViewChange,
  onHomeClick,
  onTemplateChange,
}) => {
  const renderView = () => {
    switch (activeView) {
      case 'workshop':
        return <WorkshopView />;
      case 'episodes':
        return <EpisodesView />;
      case 'write':
        return <WriteView />;
      case 'prompts':
        return <PromptsView />;
      case 'tasks':
        return <TaskView />;
      case 'ideapile':
        return <IdeaPileView onNavigate={onViewChange} />;
      default:
        return <WorkshopView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <MainNavigation
        activeView={activeView}
        onViewChange={onViewChange}
        onHomeClick={onHomeClick}
        onTemplateChange={onTemplateChange}
        template="classic"
      />
      <main className="pt-16">
        {renderView()}
      </main>
      <ChatWindow />
    </div>
  );
};