import React, { useState, useRef, useEffect } from 'react';
import { Plus, Edit } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  color: string;
  onTitleChange: (title: string) => void;
  onSubtitleChange: (subtitle: string) => void;
  onAddPoint: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  color,
  onTitleChange,
  onSubtitleChange,
  onAddPoint
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editSubtitle, setEditSubtitle] = useState(subtitle);
  
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
    }
    setIsEditingTitle(false);
  };

  const handleSubtitleSave = () => {
    if (editSubtitle.trim() && editSubtitle.trim() !== subtitle) {
      onSubtitleChange(editSubtitle.trim());
    }
    setIsEditingSubtitle(false);
  };

  return (
    <div className={cn(
      'p-4 flex items-center justify-between',
      color,
      'border-b-4 border-black'
    )}>
      <div className="text-white flex-1">
        <div className="flex items-center gap-2 group">
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
              className="bg-white/10 border-none rounded text-white font-bold text-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          ) : (
            <>
              <h3 
                className="font-bold text-lg cursor-text"
                onClick={() => setIsEditingTitle(true)}
              >
                {title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingTitle(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-1 hover:bg-white/20"
              >
                <Edit className="h-3 w-3 text-white" />
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 group">
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
                  setEditSubtitle(subtitle);
                  setIsEditingSubtitle(false);
                }
              }}
              className="bg-white/10 border-none rounded text-white text-sm px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          ) : (
            <>
              <p 
                className="text-sm opacity-90 cursor-text"
                onClick={() => setIsEditingSubtitle(true)}
              >
                {subtitle}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingSubtitle(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-1 hover:bg-white/20"
              >
                <Edit className="h-3 w-3 text-white" />
              </Button>
            </>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        className="hover:bg-white/20"
        onClick={onAddPoint}
      >
        <Plus className="h-4 w-4 text-white" />
      </Button>
    </div>
  );
};