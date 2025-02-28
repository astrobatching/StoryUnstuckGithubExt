import React, { useState } from 'react';
import { Home, Save } from 'lucide-react';
import { Button } from '../ui/button';
import { TimelineView } from '../views/TimelineView';
import { WorkshopView } from '../views/WorkshopView';
import { EpisodesView } from '../views/EpisodesView';
import { WriteView } from '../views/WriteView';
import { PromptsView } from '../views/PromptsView';
import { TaskView } from '../views/TaskView';
import { navigationItems } from '../../constants/navigation';

interface Project {
  id: string;
  name: string;
  type: 'tv-30' | 'tv-60' | 'film';
  status: 'active' | 'draft' | 'completed';
  lastModified: Date;
}

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onSave: () => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  project,
  onSave,
}) => {
  const [activeView, setActiveView] = useState('workshop');

  if (!isOpen) return null;

  const renderView = () => {
    switch (activeView) {
      case 'workshop':
        return <WorkshopView />;
      case 'episodes':
        return <EpisodesView />;
      case 'timeline':
        return <TimelineView />;
      case 'write':
        return <WriteView />;
      case 'prompts':
        return <PromptsView />;
      case 'tasks':
        return <TaskView />;
      default:
        return <WorkshopView />;
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Header */}
      <div className="h-12 border-b-4 border-black p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onClose}>
            <Home className="h-5 w-5" />
          </Button>
          <h1 className="font-bold">{project.name}</h1>
        </div>
        <Button onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Project
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex justify-center gap-4 p-2 bg-white border-b-4 border-black">
        {navigationItems.slice(1).map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={`flex items-center gap-2 px-4 py-2 border-4 border-black hover:bg-gray-100 transition-colors
              ${activeView === item.id ? 'bg-yellow-200' : ''}`}
            onClick={() => setActiveView(item.id)}
          >
            <item.icon className="h-4 w-4" />
            <span className="font-bold text-sm">{item.label}</span>
          </Button>
        ))}
      </nav>

      {/* Content */}
      <div className="h-[calc(100vh-8rem)]">
        {renderView()}
      </div>
    </div>
  );
};