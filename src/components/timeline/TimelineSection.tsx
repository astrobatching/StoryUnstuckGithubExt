import React, { useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { TimelineGrid } from './TimelineGrid';
import { ColorLegend } from './ColorLegend';
import { useTimelineStore } from '../../store/timelineStore';
import { cn } from '../../lib/utils';

export const TimelineSection: React.FC = () => {
  const { 
    timeline,
    colorLegend,
    addStoryline, 
    toggleTimelineExpanded,
    setHeight,
  } = useTimelineStore();
  
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timeline.isExpanded && contentRef.current) {
      const updateHeight = () => {
        const contentHeight = contentRef.current?.scrollHeight || 0;
        const maxHeight = window.innerHeight * 0.8; // Max 80% of viewport
        const minHeight = 300; // Minimum height
        const newHeight = Math.min(Math.max(contentHeight, minHeight), maxHeight);
        setHeight(newHeight);
      };

      updateHeight();

      const observer = new ResizeObserver(updateHeight);
      observer.observe(contentRef.current);

      return () => observer.disconnect();
    }
  }, [timeline.isExpanded, setHeight]);

  return (
    <section 
      className={cn(
        "fixed top-16 left-0 right-0 z-40 bg-white border-b-4 border-black",
        "transition-all duration-300 ease-in-out",
        colorLegend.isVisible && "content-with-legend"
      )}
      style={{ 
        height: timeline.isExpanded ? '48px' : 'auto',
        maxHeight: timeline.isExpanded ? '48px' : '80vh'
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-4 py-2 border-b-4 border-black">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTimelineExpanded}
            className="hover:bg-gray-100"
          >
            {timeline.isExpanded ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <h2 className="font-bold">Story Timeline</h2>
        </div>

        {!timeline.isExpanded && (
          <Button 
            variant="ghost" 
            onClick={() => addStoryline('New Storyline')}
            className="hover:bg-gray-100 border-2 border-black"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Storyline
          </Button>
        )}
      </div>

      {/* Scrollable Content Container */}
      {!timeline.isExpanded && (
        <div 
          ref={contentRef}
          className="overflow-y-auto"
          style={{ maxHeight: 'calc(80vh - 48px)' }}
        >
          <div className="min-w-max">
            <TimelineGrid />
          </div>
        </div>
      )}

      {/* Color Legend is now rendered independently */}
      <ColorLegend />
    </section>
  );
};