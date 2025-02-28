import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import type { Project } from '../../types/project';

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpen }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  return (
    <Card className="border-2 border-black hover:border-4 transition-all">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold">{project.name}</h4>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              {project.lastModified.toLocaleDateString()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              'px-2 py-1 rounded text-sm font-medium',
              statusColors[project.status]
            )}>
              {project.status}
            </span>
            <Button 
              size="sm" 
              onClick={() => onOpen(project)}
              className="hover:bg-gray-100"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};