import React from 'react';

interface SceneContentProps {
  content: string;
  isEditing: boolean;
  editContent: string;
  onEditStart: () => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const SceneContent: React.FC<SceneContentProps> = ({
  content,
  isEditing,
  editContent,
  onEditStart,
  onEditSave,
  onEditCancel,
  onChange
}) => {
  if (isEditing) {
    return (
      <textarea
        value={editContent}
        onChange={onChange}
        onBlur={onEditSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onEditSave();
          }
          if (e.key === 'Escape') {
            onEditCancel();
          }
        }}
        className="w-full p-2 border-2 border-black text-sm resize-none"
        autoFocus
      />
    );
  }

  return (
    <div 
      onClick={onEditStart}
      className="flex-1 text-sm cursor-text min-w-0"
    >
      {content || <span className="text-gray-400">Click to add content...</span>}
    </div>
  );
};