import React from 'react';
import { HomeView } from './views/HomeView';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { EnhancedTemplate } from './templates/EnhancedTemplate';
import { useNavigation } from '../contexts/NavigationContext';
import { useProject } from '../contexts/ProjectContext';

export function AppContent() {
  const { currentView, setCurrentView } = useNavigation();
  const { currentProject } = useProject();
  const [template, setTemplate] = React.useState<'classic' | 'enhanced'>('enhanced');

  // Always show home view if no project is selected
  if (!currentProject) {
    return <HomeView onNavigate={setCurrentView} />;
  }

  const handleTemplateChange = () => {
    setTemplate(prev => prev === 'classic' ? 'enhanced' : 'classic');
  };

  const commonProps = {
    activeView: currentView,
    onViewChange: setCurrentView,
    onHomeClick: () => setCurrentView('home'),
    onTemplateChange: handleTemplateChange,
    template
  };

  return template === 'enhanced' ? (
    <EnhancedTemplate {...commonProps} />
  ) : (
    <ClassicTemplate {...commonProps} />
  );
}