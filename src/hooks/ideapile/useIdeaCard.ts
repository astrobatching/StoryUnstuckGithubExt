import { useState, useCallback } from 'react';
import type { IdeaItem } from '../../types/ideapile';

export function useIdeaCard(item: IdeaItem, onUpdate: (id: string, updates: Partial<IdeaItem>) => void) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editContent, setEditContent] = useState(item.content);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'idea-card',
      id: item.id,
      columnId: item.columnId
    }));
    e.currentTarget.classList.add('opacity-50');
  }, [item.id, item.columnId]);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
  }, []);

  const handleSave = useCallback(() => {
    if (editTitle.trim() || editContent.trim()) {
      onUpdate(item.id, {
        title: editTitle.trim(),
        content: editContent.trim()
      });
    }
    setIsEditing(false);
  }, [item.id, editTitle, editContent, onUpdate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditTitle(item.title);
      setEditContent(item.content);
      setIsEditing(false);
    }
  }, [item.title, item.content, handleSave]);

  return {
    isExpanded,
    isEditing,
    editTitle,
    editContent,
    setIsExpanded,
    setIsEditing,
    setEditTitle,
    setEditContent,
    handleDragStart,
    handleDragEnd,
    handleSave,
    handleKeyDown
  };
}