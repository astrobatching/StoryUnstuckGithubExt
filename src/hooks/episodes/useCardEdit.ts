import { useState } from 'react';
import type { Scene } from '../../types/episode';

export function useCardEdit(initialData: Scene) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(initialData.title);
  const [editContent, setEditContent] = useState(initialData.content);

  const handleEdit = (type: 'start' | 'title' | 'content' | 'cancel', value?: string) => {
    if (type === 'start') {
      setIsEditing(true);
      return;
    }

    if (type === 'cancel') {
      setEditTitle(initialData.title);
      setEditContent(initialData.content);
      setIsEditing(false);
      return;
    }
    
    if (type === 'title') {
      setEditTitle(value || '');
    }
    
    if (type === 'content') {
      setEditContent(value || '');
    }
  };

  const handleSave = () => {
    if (editTitle.trim() || editContent.trim()) {
      const updates = {
        title: editTitle.trim(),
        content: editContent.trim()
      };
      setIsEditing(false);
      return updates;
    }
    setIsEditing(false);
    return null;
  };

  return {
    isEditing,
    editTitle,
    editContent,
    handleEdit,
    handleSave
  };
}