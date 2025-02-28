import React, { useState } from 'react';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { EnhancedTemplate } from './templates/EnhancedTemplate';
import type { ViewType } from '../constants/navigation';

interface ProjectViewProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const ProjectView: React.FC<ProjectViewProps> = ({
  activeView,
  onViewChange,
}) => {
  const [template, setTemplate] = useState<'classic' | 'enhanced'>('classic');

  const handleTemplateChange = () => {
    setTemplate(prev => prev === 'classic' ? 'enhanced' : 'classic');
  };

  const commonProps = {
    activeView,
    onViewChange,
    onHomeClick: () => onViewChange('home'),
    onTemplateChange: handleTemplateChange,
  };

  return template === 'enhanced' ? (
    <EnhancedTemplate {...commonProps} />
  ) : (
    <ClassicTemplate {...commonProps} />
  );
};