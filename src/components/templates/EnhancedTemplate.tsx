import React from 'react';
import { MainNavigation } from '../layout/MainNavigation';
import { TimelineSection } from '../timeline/TimelineSection';
import { WorkshopView } from '../workshop/WorkshopView';
import { EpisodesView } from '../episodes/EpisodesView';
import { WriteView } from '../views/WriteView';
import { PromptsView } from '../views/PromptsView';
import { TaskView } from '../views/TaskView';
import { IdeaPileView } from '../ideapile/IdeaPileView';
import { ChatWindow } from '../chat/ChatWindow';
import { useTimelineState } from '../../hooks/useTimelineState';
import type { ViewType } from '../../constants/navigation';

const TIMELINE_VIEWS = ['workshop', 'episodes', 'timeline', 'write'] as const;

interface EnhancedTemplateProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  onHomeClick: () => void;
  onTemplateChange: () => void;
  template: 'classic' | 'enhanced';
}

export const EnhancedTemplate: React.FC<EnhancedTemplateProps> = ({
  activeView,
  onViewChange,
  onHomeClick,
  onTemplateChange,
  template
}) => {
  const showTimeline = TIMELINE_VIEWS.includes(activeView as any);
  const { height, isCollapsed } = useTimelineState();

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
        template={template}
      />
      
      {showTimeline && <TimelineSection />}

      <main 
        className="transition-all duration-300"
        style={{ 
          paddingTop: showTimeline 
            ? `calc(4rem + ${isCollapsed ? '48px' : height}px)`
            : '4rem'
        }}
      >
        {renderView()}
      </main>
      <ChatWindow />
    </div>
  );
};