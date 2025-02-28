import React from 'react';
import { cn } from '../../lib/utils';
import { navigationItems, type ViewType } from '../../constants/navigation';

interface NavigationProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange }) => {
  return (
    <nav className="flex justify-center gap-4 p-2 bg-white border-b-4 border-black">
      {navigationItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 border-4 border-black hover:bg-gray-100 transition-colors',
            activeView === item.id && 'bg-yellow-200'
          )}
        >
          <item.icon className="w-4 h-4" />
          <span className="font-bold text-sm">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};