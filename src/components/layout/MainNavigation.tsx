import React from 'react';
import { Home, Layout } from 'lucide-react';
import { Button } from '../ui/button';
import { navigationItems } from '../../constants/navigation';
import type { ViewType } from '../../constants/navigation';

interface MainNavigationProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  onHomeClick: () => void;
  onTemplateChange: () => void;
  template: 'classic' | 'enhanced';
}

export const MainNavigation: React.FC<MainNavigationProps> = ({
  activeView,
  onViewChange,
  onHomeClick,
  onTemplateChange,
  template,
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-white border-b-4 border-black">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className="border-4 border-black hover:bg-gray-100"
          onClick={onHomeClick}
        >
          <Home className="h-4 w-4 mr-2" />
          <span className="font-bold text-sm">Home</span>
        </Button>
        <Button
          variant="ghost"
          className="border-4 border-black hover:bg-gray-100"
          onClick={onTemplateChange}
        >
          <Layout className="h-4 w-4 mr-2" />
          <span className="font-bold text-sm">
            Switch to {template === 'classic' ? 'Enhanced' : 'Classic'}
          </span>
        </Button>
      </div>

      <div className="flex gap-2">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={`flex items-center gap-2 px-4 py-2 border-4 border-black hover:bg-gray-100 transition-colors
              ${activeView === item.id ? 'bg-yellow-200' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <item.icon className="h-4 w-4" />
            <span className="font-bold text-sm">{item.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}