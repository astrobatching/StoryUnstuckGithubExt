import React, { useState, useRef, useEffect } from 'react';
import { EpisodeSpine } from './EpisodeSpine';
import { ActCard } from './ActCard';
import { useEpisodeState } from '../../hooks/useEpisodeState';
import { cn } from '../../lib/utils';

export const EpisodesView: React.FC = () => {
  const {
    episodes,
    openEpisodes,
    episodeData,
    toggleEpisode,
    addEpisode,
    updateEpisodeData
  } = useEpisodeState();
  
  const [stickyHeaders, setStickyHeaders] = useState<Record<number, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle scroll for sticky headers
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const episodeElements = containerRef.current.querySelectorAll('.episode-column');
      const newStickyState: Record<number, boolean> = {};
      
      episodeElements.forEach((el) => {
        const episodeId = parseInt(el.getAttribute('data-episode-id') || '0', 10);
        const rect = el.getBoundingClientRect();
        newStickyState[episodeId] = rect.top <= 0;
      });
      
      setStickyHeaders(newStickyState);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [openEpisodes]);

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      <div 
        ref={containerRef}
        className="flex-1 overflow-x-auto overflow-y-auto"
      >
        <div className="flex min-h-full">
          {Array.from(openEpisodes)
            .sort((a, b) => a - b)
            .map(ep => (
              <div 
                key={ep} 
                className="episode-column w-96 flex-shrink-0 flex flex-col border-r-4 border-black"
                data-episode-id={ep}
              >
                {/* Episode header - can be sticky */}
                <div className={cn(
                  "flex items-stretch border-b-4 border-black bg-white z-10",
                  stickyHeaders[ep] && "sticky top-0"
                )}>
                  <div className="w-12 bg-gray-100 flex items-center justify-center font-mono text-sm font-bold border-r-4 border-black">
                    EP_{String(ep).padStart(2, '0')}
                  </div>
                  <div className="flex-1 h-6" /> {/* Reduced height */}
                </div>

                <div className="flex-1 p-4 space-y-4">
                  {episodeData[ep]?.acts.map(act => (
                    <ActCard
                      key={act.id}
                      id={act.id}
                      title={act.title}
                      color={act.color}
                      scenes={act.scenes}
                      onAddScene={() => {
                        updateEpisodeData(ep, data => ({
                          ...data,
                          acts: data.acts.map(a => 
                            a.id === act.id 
                              ? { 
                                  ...a, 
                                  scenes: [...a.scenes, { 
                                    id: Date.now(), 
                                    title: `Scene ${a.scenes.length + 1}`, 
                                    content: '' 
                                  }] 
                                } 
                              : a
                          )
                        }));
                      }}
                      onUpdateScene={(sceneId, updates) => {
                        updateEpisodeData(ep, data => ({
                          ...data,
                          acts: data.acts.map(a => 
                            a.id === act.id 
                              ? { 
                                  ...a, 
                                  scenes: a.scenes.map(scene => 
                                    scene.id === sceneId ? { ...scene, ...updates } : scene
                                  ) 
                                } 
                              : a
                          )
                        }));
                      }}
                      onDeleteScene={(sceneId) => {
                        updateEpisodeData(ep, data => ({
                          ...data,
                          acts: data.acts.map(a => 
                            a.id === act.id 
                              ? { 
                                  ...a, 
                                  scenes: a.scenes.filter(scene => scene.id !== sceneId) 
                                } 
                              : a
                          )
                        }));
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      <EpisodeSpine
        episodes={episodes}
        openEpisodes={openEpisodes}
        onEpisodeToggle={toggleEpisode}
        onAddEpisode={addEpisode}
      />
    </div>
  );
};