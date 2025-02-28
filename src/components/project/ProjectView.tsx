import React from 'react';
import { ClassicTemplate } from '../templates/ClassicTemplate';
import { EnhancedTemplate } from '../templates/EnhancedTemplate';
import type { Project } from '../../types/project';
import type { ViewType } from '../../constants/navigation';

interface ProjectViewProps {
  project: Project;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  onHomeClick: () => void;
  onTemplateChange: () => void;
  onSave: (project: Project) => void;
}

export const ProjectView: React.FC<ProjectViewProps> = ({
  project,
  activeView,
  onViewChange,
  onHomeClick,
  onTemplateChange,
  onSave,
}) => {
  const commonProps = {
    activeView,
    onViewChange,
    onHomeClick,
    onTemplateChange,
    project,
    onSave,
  };

  return project.template === 'enhanced' ? (
    <EnhancedTemplate {...commonProps} />
  ) : (
    <ClassicTemplate {...commonProps} />
  );
};