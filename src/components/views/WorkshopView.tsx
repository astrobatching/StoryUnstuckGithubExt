import React, { useState } from 'react';
import { QuadrantColumn } from '../workshop/QuadrantColumn';
import { ChatWindow } from '../chat/ChatWindow';
import { defaultPlotSections } from '../../constants/plotSections';
import type { Story, PlotPoint, Section } from '../../types/workshop';

const defaultQuadrants = [
  { id: 'q1', title: 'Quadrant 1' },
  { id: 'q2', title: 'Quadrant 2' },
  { id: 'q3', title: 'Quadrant 3' },
  { id: 'q4', title: 'Quadrant 4' },
];

export const WorkshopView: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [openQuadrants, setOpenQuadrants] = useState(new Set(['q1']));
  const [expandedQuadrant, setExpandedQuadrant] = useState<string | null>(null);
  const [plotPoints, setPlotPoints] = useState<Record<string, Array<PlotPoint>>>({});
  const [plotSections, setPlotSections] = useState<Record<string, Section[]>>({
    q1: [...defaultPlotSections],
    q2: [...defaultPlotSections],
    q3: [...defaultPlotSections],
    q4: [...defaultPlotSections],
  });

  const handleAddStory = (quadrantId: string) => {
    const newStory: Story = {
      id: Date.now().toString(),
      title: 'New Story Idea',
      content: 'Start writing your story idea here...',
      quadrantId,
    };
    setStories([...stories, newStory]);
  };

  const handleDeleteStory = (id: string) => {
    setStories(stories.filter((story) => story.id !== id));
  };

  const handleUpdateStory = (id: string, title: string, content: string) => {
    setStories(
      stories.map((story) =>
        story.id === id ? { ...story, title, content } : story
      )
    );
  };

  const toggleQuadrant = (quadrantId: string) => {
    const newOpen = new Set(openQuadrants);
    if (newOpen.has(quadrantId)) {
      newOpen.delete(quadrantId);
    } else {
      newOpen.add(quadrantId);
    }
    setOpenQuadrants(newOpen);
  };

  const handleAddPlotPoint = (quadrantId: string, sectionId: string) => {
    const newPlotPoint = {
      id: Date.now().toString(),
      content: 'New plot point...',
      sectionId
    };
    
    setPlotPoints(prev => ({
      ...prev,
      [quadrantId]: [...(prev[quadrantId] || []), newPlotPoint]
    }));
  };

  const handleUpdatePlotPoint = (quadrantId: string, pointId: string, content: string) => {
    setPlotPoints(prev => ({
      ...prev,
      [quadrantId]: prev[quadrantId].map(point => 
        point.id === pointId ? { ...point, content } : point
      )
    }));
  };

  const handleDeletePlotPoint = (quadrantId: string, pointId: string) => {
    setPlotPoints(prev => ({
      ...prev,
      [quadrantId]: prev[quadrantId].filter(point => point.id !== pointId)
    }));
  };

  const handleUpdateSection = (quadrantId: string, sectionId: string, updates: Partial<Section>) => {
    setPlotSections(prev => ({
      ...prev,
      [quadrantId]: prev[quadrantId].map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  };

  return (
    <div className="h-screen flex">
      <div className="flex-1 flex">
        {defaultQuadrants.map((quadrant) => (
          <QuadrantColumn
            key={quadrant.id}
            id={quadrant.id}
            title={quadrant.title}
            stories={stories.filter((s) => s.quadrantId === quadrant.id)}
            plotSections={plotSections[quadrant.id]}
            plotPoints={plotPoints[quadrant.id] || []}
            isOpen={openQuadrants.has(quadrant.id)}
            isExpanded={expandedQuadrant === quadrant.id}
            onToggle={() => toggleQuadrant(quadrant.id)}
            onExpand={() => setExpandedQuadrant(quadrant.id)}
            onCollapse={() => setExpandedQuadrant(null)}
            onAddStory={handleAddStory}
            onDeleteStory={handleDeleteStory}
            onUpdateStory={handleUpdateStory}
            onAddPlotPoint={handleAddPlotPoint}
            onUpdatePlotPoint={handleUpdatePlotPoint}
            onDeletePlotPoint={handleDeletePlotPoint}
            onUpdateSection={(sectionId, updates) => 
              handleUpdateSection(quadrant.id, sectionId, updates)
            }
          />
        ))}
        
        <div className="w-80 border-l-4 border-black">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
};