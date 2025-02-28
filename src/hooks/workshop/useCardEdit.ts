import { useState } from 'react';
import type { Story } from '../../types/workshop';

export function useCardEdit(initialData: Story) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(initialData.title);
  const [editContent, setEditContent] = useState(initialData.content);

  const handleEdit = (type: 'start' | 'title' | 'content', value?: string) => {
    if (type === 'start') {
      setIsEditing(true);
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
      // Return updated data
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