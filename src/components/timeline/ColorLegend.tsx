import React from 'react';
import { Grip, ChevronDown, ChevronUp, Plus, Square } from 'lucide-react';
import { Button } from '../ui/button';
import { useTimelineStore } from '../../store/timelineStore';
import { cn } from '../../lib/utils';

export const ColorLegend: React.FC = () => {
  const { 
    addCard, 
    unassignedCards, 
    colorLegend,
    toggleColorLegendExpanded 
  } = useTimelineStore();

  const handleAddWhiteCard = () => {
    const content = prompt('Enter card content:');
    if (content) {
      addCard({
        content,
        source: 'manual',
        color: 'white'
      });
    }
  };

  if (!colorLegend.isVisible) return null;

  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black",
        "transition-all duration-300 ease-in-out z-50",
        "shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]",
        colorLegend.isExpanded ? "translate-y-0" : "translate-y-[calc(100%-2.5rem)]",
        "hover:shadow-lg"
      )}
      style={{
        maxHeight: '40vh',
        width: '100%',
        pointerEvents: 'auto'
      }}
    >
      {/* Header - Always visible */}
      <div className="h-10 px-4 flex items-center justify-between bg-white sticky top-0 z-10 cursor-pointer"
           onClick={() => toggleColorLegendExpanded()}>
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold">Color Legend</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-1 hover:bg-gray-100"
          >
            {colorLegend.isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronUp className="h-3 w-3" />
            )}
          </Button>
        </div>
        <Button
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            handleAddWhiteCard();
          }}
          className="border-2 border-black hover:bg-gray-50 h-7 text-xs"
        >
          <Square className="h-3 w-3 mr-1" />
          Add Card
        </Button>
      </div>

      {/* Scrollable Content */}
      <div 
        className="overflow-y-auto bg-white" 
        style={{ maxHeight: 'calc(40vh - 2.5rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Unassigned Cards */}
        {unassignedCards.length > 0 && (
          <div className="p-3">
            <h4 className="text-xs font-medium mb-2">Unassigned Cards</h4>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {unassignedCards.map((card, index) => (
                <div 
                  key={`${card.id}-${index}`} // Ensure unique keys by combining id and index
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/json', JSON.stringify({
                      type: 'storyline-card',
                      cardId: card.id
                    }));
                  }}
                  className="flex-shrink-0 w-48 h-16 p-2 bg-white border-2 border-black rounded cursor-move hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-1 mb-1">
                    <Grip className="h-3 w-3 text-gray-400" />
                    <span className="text-xs flex-1 truncate">{card.content}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};