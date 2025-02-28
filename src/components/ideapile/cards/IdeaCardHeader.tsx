import React from 'react';
import { Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';

interface IdeaCardHeaderProps {
  title: string;
  createdAt: Date;
  isExpanded: boolean;
  isEditing: boolean;
  editTitle: string;
  onEditTitleChange: (value: string) => void;
  onToggleExpand: () => void;
  onToggleEdit: () => void;
  onDelete: () => void;
}

export const IdeaCardHeader: React.FC<IdeaCardHeaderProps> = ({
  title,
  createdAt,
  isExpanded,
  isEditing,
  editTitle,
  onEditTitleChange,
  onToggleExpand,
  onToggleEdit,
  onDelete
}) => {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-start gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleExpand}
          className="mt-1 h-6 w-6 p-1"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>

        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => onEditTitleChange(e.target.value)}
              className="w-full font-bold text-lg border-2 border-black px-2 py-1"
              autoFocus
            />
          ) : (
            <h3 className="font-bold text-lg">{title}</h3>
          )}
          <div className="text-sm text-gray-500">
            {createdAt.toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleEdit}
          className="h-8 w-8 p-1"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-8 w-8 p-1"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};