import React, { useState } from 'react';
import { Plus, FolderOpen, Lightbulb } from 'lucide-react';
import { Button } from '../ui/button';
import { ProjectCard } from './ProjectCard';
import type { Project } from '../../types/project';
import type { ViewType } from '../../constants/navigation';

interface HomeViewProps {
  onCreateProject: (type: Project['type']) => void;
  onOpenProject: (project: Project) => void;
  onNavigate: (view: ViewType) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onCreateProject,
  onOpenProject,
  onNavigate
}) => {
  const [recentProjects] = useState<Project[]>([]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Story Projects</h1>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => onCreateProject('tv-30')}>
              <Plus className="h-4 w-4 mr-2" />
              30-Min Show
            </Button>
            <Button onClick={() => onCreateProject('tv-60')}>
              <Plus className="h-4 w-4 mr-2" />
              60-Min Show
            </Button>
            <Button onClick={() => onCreateProject('film')}>
              <Plus className="h-4 w-4 mr-2" />
              Feature Film
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold mb-4">Recent Projects</h2>
              <div className="space-y-4">
                {recentProjects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onOpen={onOpenProject}
                  />
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold mb-4">Quick Access</h2>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  className="h-32 border-4 border-black hover:bg-gray-50"
                  onClick={() => onNavigate('ideapile')}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Lightbulb className="h-8 w-8" />
                    <span className="font-bold">Idea Pile</span>
                    <span className="text-sm text-gray-600">Collect and organize ideas</span>
                  </div>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};