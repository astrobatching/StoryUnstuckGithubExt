import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface PlotSectionHeaderProps {
  title: string;
  subtitle?: string;
  color: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onAdd: () => void;
  onDelete: () => void;
  onTitleChange: (title: string) => void;
  onSubtitleChange: (subtitle: string) => void;
}

export const PlotSectionHeader: React.FC<PlotSectionHeaderProps> = ({
  title,
  subtitle,
  color,
  isExpanded,
  onToggleExpand,
  onAdd,
  onDelete,
  onTitleChange,
  onSubtitleChange,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editSubtitle, setEditSubtitle] = useState(subtitle || '');
  
  const titleInputRef = useRef<HTMLInputElement>(null);
  const subtitleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (isEditingSubtitle && subtitleInputRef.current) {
      subtitleInputRef.current.focus();
      subtitleInputRef.current.select();
    }
  }, [isEditingSubtitle]);

  const handleTitleSave = () => {
    if (editTitle.trim() && editTitle.trim() !== title) {
      onTitleChange(editTitle.trim());
    } else {
      setEditTitle(title);
    }
    setIsEditingTitle(false);
  };

  const handleSubtitleSave = () => {
    if (editSubtitle.trim() !== subtitle) {
      onSubtitleChange(editSubtitle.trim());
    } else {
      setEditSubtitle(subtitle || '');
    }
    setIsEditingSubtitle(false);
  };

  return (
    <div className={cn(
      'h-8 flex items-center justify-between px-2 transition-colors',
      color,
      'border-b-4 border-black'
    )}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleExpand}
          className="h-6 w-6 p-1 hover:bg-white/10"
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3 text-white" />
          ) : (
            <ChevronRight className="h-3 w-3 text-white" />
          )}
        </Button>

        <div className="flex flex-col min-w-0">
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSave();
                if (e.key === 'Escape') {
                  setEditTitle(title);
                  setIsEditingTitle(false);
                }
              }}
              className="h-5 px-1 bg-white/10 border-none rounded text-white text-xs font-bold focus:outline-none focus:ring-1 focus:ring-white/50"
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="text-left text-white text-xs font-bold truncate hover:bg-white/10 px-1 rounded"
            >
              {title}
            </button>
          )}

          {isEditingSubtitle ? (
            <input
              ref={subtitleInputRef}
              type="text"
              value={editSubtitle}
              onChange={(e) => setEditSubtitle(e.target.value)}
              onBlur={handleSubtitleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubtitleSave();
                if (e.key === 'Escape') {
                  setEditSubtitle(subtitle || '');
                  setIsEditingSubtitle(false);
                }
              }}
              className="h-4 px-1 bg-white/10 border-none rounded text-white text-[10px] focus:outline-none focus:ring-1 focus:ring-white/50"
              placeholder="Add subtitle..."
            />
          ) : (
            <button
              onClick={() => setIsEditingSubtitle(true)}
              className="text-left text-white/80 text-[10px] truncate hover:bg-white/10 px-1 rounded"
            >
              {subtitle || 'Add subtitle...'}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onAdd}
          className="h-6 w-6 p-1 hover:bg-white/10"
        >
          <Plus className="h-3 w-3 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-6 w-6 p-1 hover:bg-white/10"
        >
          <X className="h-3 w-3 text-white" />
        </Button>
      </div>
    </div>
  );
};