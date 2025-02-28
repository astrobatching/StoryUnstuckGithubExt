import React from 'react';
import { cn } from '../../../lib/utils';
import { useWriteNavigation } from '../../../hooks/write/useWriteNavigation';
import { logger } from '../../../utils/logger';

interface WriteNavigationProps {
  isCollapsed: boolean;
  activeSceneId?: string;
  onSceneSelect: (sceneId?: string) => void;
}

export const WriteNavigation: React.FC<WriteNavigationProps> = ({
  isCollapsed,
  activeSceneId,
  onSceneSelect
}) => {
  const { acts, getSceneCount } = useWriteNavigation();

  const handleSceneClick = (sceneId: string) => {
    logger.debug('Scene clicked', { sceneId });
    onSceneSelect(sceneId);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {acts.map(act => {
        const sceneCount = getSceneCount(act.id);
        
        return (
          <div key={act.id} className="border-b border-black last:border-b-0">
            <div className={cn(
              act.color,
              "px-4 py-2 font-mono font-bold text-white",
              isCollapsed && "text-center"
            )}>
              {isCollapsed ? '•' : act.title}
            </div>
            
            <div className="py-2">
              {Array.from({ length: sceneCount }).map((_, index) => {
                const sceneId = `${act.id}-${index + 1}`;
                
                return (
                  <button
                    key={sceneId}
                    onClick={() => handleSceneClick(sceneId)}
                    className={cn(
                      "w-full text-left px-4 py-2 font-mono text-sm",
                      "hover:bg-gray-50 transition-colors",
                      activeSceneId === sceneId && `${act.color}/20`
                    )}
                  >
                    {isCollapsed ? (index + 1) : `Scene ${index + 1}`}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};