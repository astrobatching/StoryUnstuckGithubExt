import React, { useState, useCallback } from 'react';
import { QuadrantColumn } from './QuadrantColumn';
import { cn } from '../../lib/utils';
import type { PlotPoint, DragItem } from '../../types/workshop';

export const PLOT_SECTIONS = [
  { id: 'setup', title: 'Setup', subtitle: 'Establish the world and characters', color: 'bg-blue-500' },
  { id: 'conflict', title: 'Conflict', subtitle: 'Introduce the main conflict', color: 'bg-red-500' },
  { id: 'rising', title: 'Rising Action', subtitle: 'Escalate the stakes', color: 'bg-yellow-500' },
  { id: 'climax', title: 'Climax', subtitle: 'The highest point of tension', color: 'bg-purple-500' },
  { id: 'falling', title: 'Falling Action', subtitle: 'Show the aftermath', color: 'bg-green-500' },
  { id: 'resolution', title: 'Resolution', subtitle: 'Wrap up loose ends', color: 'bg-gray-500' }
] as const;

const defaultQuadrants = [
  { id: 'q1', title: 'Quadrant 1' },
  { id: 'q2', title: 'Quadrant 2' },
  { id: 'q3', title: 'Quadrant 3' },
  { id: 'q4', title: 'Quadrant 4' },
];

export const WorkshopView: React.FC = () => {
  const [plotPoints, setPlotPoints] = useState<PlotPoint[]>([]);
  const [openQuadrants, setOpenQuadrants] = useState(new Set(['q1']));
  const [expandedQuadrant, setExpandedQuadrant] = useState<string | null>(null);
  const [sections, setSections] = useState(PLOT_SECTIONS);

  const handleAddPoint = useCallback((sectionId: string) => {
    const newPoint: PlotPoint = {
      id: Date.now().toString(),
      content: '',
      sectionId,
      position: plotPoints.filter(p => p.sectionId === sectionId).length
    };
    setPlotPoints(prev => [...prev, newPoint]);
  }, [plotPoints]);

  const handleUpdatePoint = useCallback((id: string, content: string) => {
    setPlotPoints(prev => 
      prev.map(point => 
        point.id === id ? { ...point, content } : point
      )
    );
  }, []);

  const handleDeletePoint = useCallback((id: string) => {
    setPlotPoints(prev => prev.filter(point => point.id !== id));
  }, []);

  const handleUpdateSection = useCallback((sectionId: string, updates: { title?: string; subtitle?: string }) => {
    setSections(prev => 
      prev.map(section =>
        section.id === sectionId
          ? { ...section, ...updates }
          : section
      )
    );
  }, []);

  const handleMovePoint = useCallback((draggedItem: DragItem, targetSectionId: string, targetIndex: number) => {
    setPlotPoints(prev => {
      // Remove the dragged item
      const withoutDragged = prev.filter(p => p.id !== draggedItem.id);
      
      // Create updated item with new section and position
      const updatedItem: PlotPoint = {
        id: draggedItem.id,
        content: draggedItem.content,
        sectionId: targetSectionId,
        position: targetIndex
      };

      // Insert at new position
      const result = [...withoutDragged];
      result.splice(targetIndex, 0, updatedItem);

      // Update positions for all items in affected sections
      return result.map((point, index) => ({
        ...point,
        position: index
      }));
    });
  }, []);

  const toggleQuadrant = useCallback((id: string) => {
    setOpenQuadrants(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      <div className="flex-1 flex overflow-x-auto">
        {defaultQuadrants.map(quadrant => (
          <QuadrantColumn
            key={quadrant.id}
            {...quadrant}
            plotSections={sections}
            plotPoints={plotPoints}
            isOpen={openQuadrants.has(quadrant.id)}
            isExpanded={expandedQuadrant === quadrant.id}
            onToggle={() => toggleQuadrant(quadrant.id)}
            onExpand={() => setExpandedQuadrant(quadrant.id)}
            onCollapse={() => setExpandedQuadrant(null)}
            onAddPoint={handleAddPoint}
            onUpdatePoint={handleUpdatePoint}
            onDeletePoint={handleDeletePoint}
            onUpdateSection={handleUpdateSection}
            onMovePoint={handleMovePoint}
          />
        ))}
      </div>
    </div>
  );
};