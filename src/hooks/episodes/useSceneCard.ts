import { useState, useCallback } from 'react';
import { logger } from '../../utils/logger';
import type { Scene } from '../../types/episode';

export function useSceneCard(scene: Scene) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(scene.content);
  const [isDragging, setIsDragging] = useState(false);

  const handleEditStart = useCallback(() => {
    setIsEditing(true);
    setEditContent(scene.content);
  }, [scene.content]);

  const handleEditSave = useCallback(() => {
    if (editContent.trim() !== scene.content) {
      logger.debug('Saving scene content:', { sceneId: scene.id, content: editContent });
      onUpdate(scene.id, { content: editContent.trim() });
    }
    setIsEditing(false);
  }, [editContent, scene.id, scene.content]);

  const handleEditCancel = useCallback(() => {
    setIsEditing(false);
    setEditContent(scene.content);
  }, [scene.content]);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditContent(e.target.value);
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    setIsDragging(true);
    const dragData = {
      type: 'scene',
      id: scene.id,
      actId: scene.actId,
      scene
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
  }, [scene]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    isEditing,
    editContent,
    isDragging,
    handleEditStart,
    handleEditSave,
    handleEditCancel,
    handleContentChange,
    handleDragStart,
    handleDragEnd
  };
}