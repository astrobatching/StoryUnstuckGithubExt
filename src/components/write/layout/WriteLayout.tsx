import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';
import { WriteNavigation } from './WriteNavigation';
import { cn } from '../../../lib/utils';

interface WriteLayoutProps {
  children: React.ReactNode;
  isNavCollapsed: boolean;
  onToggleNav: () => void;
  activeSceneId?: string;
  onSceneSelect: (sceneId?: string) => void;
}

export const WriteLayout: React.FC<WriteLayoutProps> = ({
  children,
  isNavCollapsed,
  onToggleNav,
  activeSceneId,
  onSceneSelect
}) => {
  return (
    <div className="h-screen flex bg-white">
      {/* Scene Navigation */}
      <div 
        className={cn(
          "border-r-4 border-black flex flex-col",
          "transition-all duration-300 ease-in-out",
          isNavCollapsed ? "w-12" : "w-64"
        )}
      >
        {/* Navigation Header */}
        <div className="p-4 border-b-4 border-black bg-gray-50 flex justify-between items-center">
          <span className={cn(
            "font-mono font-bold",
            isNavCollapsed && "hidden"
          )}>
            EP_01
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onToggleNav}
            className="hover:bg-gray-200"
          >
            {isNavCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation Content */}
        <WriteNavigation
          isCollapsed={isNavCollapsed}
          activeSceneId={activeSceneId}
          onSceneSelect={onSceneSelect}
        />

        {/* Navigation Footer */}
        <div className="border-t-4 border-black p-2">
          <Button 
            className={cn(
              "w-full border-2 border-black font-mono text-sm",
              "bg-black text-white hover:bg-gray-800"
            )}
          >
            {isNavCollapsed ? '←' : 'EPISODE VIEW'}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};