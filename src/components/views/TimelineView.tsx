import React, { useState } from 'react';
import { Grid, Columns, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { WorkshopView } from './WorkshopView';
import { EpisodesView } from './EpisodesView';
import { ChatWindow } from '../chat/ChatWindow';

interface Storyline {
  id: string;
  title: string;
  color: string;
}

interface StoryCard {
  id: string;
  title: string;
  content: string;
  storylineId: string | null;
  episode: number | null;
}

export const TimelineView: React.FC = () => {
  const [storylines, setStorylines] = useState<Storyline[]>([]);
  const [selectedView, setSelectedView] = useState<'workshop' | 'episodes' | null>(null);
  const [episodes] = useState(['EP_01', 'EP_02', 'EP_03', 'EP_04', 'EP_05', 'EP_06']);
  const [cards, setCards] = useState<StoryCard[]>([]);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(true);

  const handleAddStoryline = () => {
    const colors = [
      '#FF3AF2', // Pink
      '#00FFF0', // Cyan
      '#FFE600', // Yellow
      '#FF4D4D', // Red
      '#4DFF4D', // Green
      '#4D4DFF'  // Blue
    ];
    
    const newStoryline: Storyline = {
      id: Date.now().toString(),
      title: `Storyline ${storylines.length + 1}`,
      color: colors[storylines.length % colors.length]
    };
    setStorylines([...storylines, newStoryline]);
  };

  const handleDrop = (storylineId: string, episode: string, e: React.DragEvent) => {
    e.preventDefault();
    try {
      const cardData = JSON.parse(e.dataTransfer.getData('application/json'));
      if (cardData.type === 'story-card') {
        setCards(prev => prev.map(card => 
          card.id === cardData.id 
            ? { ...card, storylineId, episode: parseInt(episode.split('_')[1]) }
            : card
        ));
      }
    } catch (err) {
      console.error('Failed to process drop:', err);
    }
  };

  const toggleView = (view: 'workshop' | 'episodes') => {
    setSelectedView(currentView => currentView === view ? null : view);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Timeline Header */}
      <div className="flex justify-between items-center p-2 border-b-2 border-black bg-white">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
          >
            {isTimelineExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          <Button onClick={handleAddStoryline} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Storyline
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={selectedView === 'workshop' ? 'bg-gray-100' : ''}
            onClick={() => toggleView('workshop')}
          >
            <Grid className="h-4 w-4 mr-1" />
            Workshop
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={selectedView === 'episodes' ? 'bg-gray-100' : ''}
            onClick={() => toggleView('episodes')}
          >
            <Columns className="h-4 w-4 mr-1" />
            Episodes
          </Button>
        </div>
      </div>

      {/* Timeline Grid */}
      <div 
        className={`overflow-auto bg-white transition-all duration-300 ease-in-out ${
          isTimelineExpanded ? 'h-[30vh]' : 'h-12'
        }`}
      >
        <div className="min-w-max">
          <div className="grid grid-cols-7 gap-1 bg-gray-100 p-2 sticky top-0">
            <div className="font-bold">Storylines</div>
            {episodes.map(episode => (
              <div key={episode} className="font-bold text-center">{episode}</div>
            ))}
          </div>
          {isTimelineExpanded && (
            <div className="space-y-2 p-2">
              {storylines.map(storyline => (
                <div key={storyline.id} className="grid grid-cols-7 gap-1">
                  <div className="p-2 font-medium flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: storyline.color }}
                    />
                    {storyline.title}
                  </div>
                  {episodes.map(episode => (
                    <div 
                      key={`${storyline.id}-${episode}`}
                      className="p-2 border-2 border-black bg-white"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(storyline.id, episode, e)}
                    >
                      {cards
                        .filter(card => 
                          card.storylineId === storyline.id && 
                          card.episode === parseInt(episode.split('_')[1])
                        )
                        .map(card => (
                          <div
                            key={card.id}
                            className="p-2 text-sm rounded"
                            style={{ backgroundColor: storyline.color }}
                          >
                            {card.title}
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Workshop/Episodes View */}
      {selectedView && (
        <div className="flex-1 border-t-2 border-black overflow-hidden">
          {selectedView === 'workshop' ? (
            <WorkshopView />
          ) : (
            <EpisodesView />
          )}
        </div>
      )}

      {/* Chat Window */}
      <ChatWindow />
    </div>
  );
};