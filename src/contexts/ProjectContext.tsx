import React, { createContext, useContext, useState } from 'react';
import type { Project } from '../types/project';

interface ProjectContextType {
  currentProject: Project | null;
  projects: Project[];
  openProject: (project: Project) => void;
  createProject: (type: Project['type']) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const openProject = (project: Project) => {
    setCurrentProject(project);
  };

  const createProject = (type: Project['type']) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: `New ${type === 'tv-30' ? '30-min' : type === 'tv-60' ? '60-min' : 'Film'} Project`,
      type,
      status: 'draft',
      lastModified: new Date(),
      template: 'enhanced'
    };
    setProjects(prev => [...prev, newProject]);
    setCurrentProject(newProject);
  };

  return (
    <ProjectContext.Provider value={{ currentProject, projects, openProject, createProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}