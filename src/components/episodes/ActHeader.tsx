import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../ui/button';
import { EditableText } from './header/EditableText';
import { cn } from '../../lib/utils';

interface ActHeaderProps {
  title: string;
  subtitle?: string;
  color: string;
  onAdd: () => void;
  onDelete: () => void;
  onTitleChange: (title: string) => void;
  onSubtitleChange: (subtitle: string) => void;
}

export const ActHeader: React.FC<ActHeaderProps> = ({
  title,
  subtitle,
  color,
  onAdd,
  onDelete,
  onTitleChange,
  onSubtitleChange,
}) => {
  return (
    <div className={cn(
      'h-8 flex items-center justify-between px-2',
      color,
      'border-b-4 border-black'
    )}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="flex flex-col min-w-0">
          <EditableText
            value={title}
            onChange={onTitleChange}
            isTitle
          />
          <EditableText
            value={subtitle || ''}
            onChange={onSubtitleChange}
            placeholder="Add subtitle..."
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onAdd}
          className="h-6 w-6 p-1 hover:bg-white/20"
        >
          <Plus className="h-3 w-3 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-6 w-6 p-1 hover:bg-white/20"
        >
          <X className="h-3 w-3 text-white" />
        </Button>
      </div>
    </div>
  );
};