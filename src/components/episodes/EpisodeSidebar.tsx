import React from 'react';
import { ChevronRight, ChevronDown, Circle } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Episode } from '../../types/episode';

type EpisodeSidebarProps = {
  episodes: Episode[];
  activeEpisodeId: string | null;
  onEpisodeSelect: (episodeId: string) => void;
};

const StatusIndicator: React.FC<{ status: Episode['status'] }> = ({ status }) => {
  const colors = {
    draft: 'bg-yellow-400',
    complete: 'bg-green-400',
    ready: 'bg-blue-400',
  };

  return <Circle className={cn('w-3 h-3', colors[status])} />;
};

export const EpisodeSidebar: React.FC<EpisodeSidebarProps> = ({
  episodes,
  activeEpisodeId,
  onEpisodeSelect,
}) => {
  const [expandedEpisodes, setExpandedEpisodes] = React.useState<string[]>([]);

  const toggleExpanded = (episodeId: string) => {
    setExpandedEpisodes(prev =>
      prev.includes(episodeId)
        ? prev.filter(id => id !== episodeId)
        : [...prev, episodeId]
    );
  };

  return (
    <div className="w-64 border-r-4 border-black bg-white">
      <div className="p-4 border-b-4 border-black">
        <h2 className="font-bold text-lg">Episodes</h2>
      </div>
      <div className="p-2">
        {episodes.map(episode => (
          <div key={episode.id} className="mb-2">
            <button
              className={cn(
                'w-full p-2 flex items-center gap-2 border-4 border-black hover:bg-gray-50',
                activeEpisodeId === episode.id && 'bg-yellow-200'
              )}
              onClick={() => {
                onEpisodeSelect(episode.id);
                toggleExpanded(episode.id);
              }}
            >
              {expandedEpisodes.includes(episode.id) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span className="font-bold">Episode {episode.number}</span>
              <StatusIndicator status={episode.status} />
            </button>
            {expandedEpisodes.includes(episode.id) && (
              <div className="ml-4 mt-2 p-2 border-l-4 border-black">
                {episode.acts.map(act => (
                  <div key={act.id} className="mb-1 text-sm">
                    {act.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};