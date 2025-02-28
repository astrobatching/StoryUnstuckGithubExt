import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';

interface ExpandToggleProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export const ExpandToggle: React.FC<ExpandToggleProps> = ({
  isExpanded,
  onToggle,
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="h-6 w-6 p-1 hover:bg-white/10"
    >
      {isExpanded ? (
        <ChevronDown className="h-3 w-3 text-white" />
      ) : (
        <ChevronRight className="h-3 w-3 text-white" />
      )}
    </Button>
  );
};