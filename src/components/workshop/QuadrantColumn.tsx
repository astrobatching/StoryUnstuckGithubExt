import React from 'react';
import { ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { PlotPointCard } from './PlotPointCard';
import { SectionHeader } from './SectionHeader';
import type { PlotPoint, DragItem } from '../../types/workshop';

interface QuadrantColumnProps {
  id: string;
  title: string;
  plotSections: typeof PLOT_SECTIONS;
  plotPoints: PlotPoint[];
  isOpen: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onExpand: () => void;
  onCollapse: () => void;
  onAddPoint: (sectionId: string) => void;
  onUpdatePoint: (id: string, content: string) => void;
  onDeletePoint: (id: string) => void;
  onUpdateSection: (sectionId: string, updates: { title?: string; subtitle?: string }) => void;
  onMovePoint: (draggedItem: DragItem, targetSectionId: string, targetIndex: number) => void;
}

export const QuadrantColumn: React.FC<QuadrantColumnProps> = ({
  id,
  title,
  plotSections,
  plotPoints,
  isOpen,
  isExpanded,
  onToggle,
  onExpand,
  onCollapse,
  onAddPoint,
  onUpdatePoint,
  onDeletePoint,
  onUpdateSection,
  onMovePoint
}) => {
  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-gray-100/50', 'border-2', 'border-dashed', 'border-black/30');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-gray-100/50', 'border-2', 'border-dashed', 'border-black/30');
  };

  const handleDrop = (e: React.DragEvent, sectionId: string, index: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-100/50', 'border-2', 'border-dashed', 'border-black/30');

    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json')) as DragItem;
      if (dragData.type === 'plot-point') {
        onMovePoint(dragData, sectionId, index);
      }
    } catch (error) {
      console.error('Failed to process drop:', error);
    }
  };

  return (
    <div 
      className={cn(
        "flex-shrink-0 flex flex-col border-4 border-black bg-white",
        "transition-all duration-300",
        isExpanded ? "w-full" : "w-96"
      )}
    >
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b-4 border-black">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="hover:bg-gray-100"
          >
            <ChevronRight className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-90"
            )} />
          </Button>
          <h2 className="font-bold">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={isExpanded ? onCollapse : onExpand}
            className="hover:bg-gray-100"
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {plotSections.map((section) => {
            const sectionPoints = plotPoints
              .filter(point => point.sectionId === section.id)
              .sort((a, b) => (a.position || 0) - (b.position || 0));
            const emptySlots = Math.max(0, 5 - sectionPoints.length);

            return (
              <div key={section.id} className="border-4 border-black">
                <SectionHeader
                  title={section.title}
                  subtitle={section.subtitle}
                  color={section.color}
                  onTitleChange={(title) => onUpdateSection(section.id, { title })}
                  onSubtitleChange={(subtitle) => onUpdateSection(section.id, { subtitle })}
                  onAddPoint={() => onAddPoint(section.id)}
                />

                {/* Card Grid */}
                <div 
                  className="grid grid-cols-5 gap-4 p-4"
                  onDragOver={(e) => handleDragOver(e, section.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, section.id, sectionPoints.length)}
                >
                  {sectionPoints.map((point, index) => (
                    <div
                      key={point.id}
                      onDragOver={(e) => handleDragOver(e, section.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, section.id, index)}
                    >
                      <PlotPointCard
                        {...point}
                        onUpdate={onUpdatePoint}
                        onDelete={onDeletePoint}
                      />
                    </div>
                  ))}
                  {Array.from({ length: emptySlots }).map((_, i) => (
                    <div
                      key={i}
                      onClick={() => onAddPoint(section.id)}
                      className="aspect-[3/2] border-2 border-black/20 hover:border-black border-dashed rounded p-2 flex items-center justify-center text-sm text-gray-400 cursor-pointer"
                      onDragOver={(e) => handleDragOver(e, section.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, section.id, sectionPoints.length + i)}
                    >
                      New plot point...
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};