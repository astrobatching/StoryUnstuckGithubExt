import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';

interface HeaderActionsProps {
  onAdd: () => void;
  onDelete: () => void;
  className?: string;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  onAdd,
  onDelete,
  className
}) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={onAdd}
        className="h-6 w-6 p-1 hover:bg-white/20 transition-colors"
      >
        <Plus className="h-3 w-3 text-white" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="h-6 w-6 p-1 hover:bg-white/20 transition-colors"
      >
        <X className="h-3 w-3 text-white" />
      </Button>
    </div>
  );
};