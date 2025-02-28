import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../../lib/utils';

export interface EditableTextProps {
  value: string;
  placeholder?: string;
  isTitle?: boolean;
  onChange: (value: string) => void;
  className?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  placeholder = 'Add text...',
  isTitle = false,
  onChange,
  className
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() && editValue.trim() !== value) {
      onChange(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  return isEditing ? (
    <input
      ref={inputRef}
      type="text"
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      className={cn(
        'px-1 bg-white/10 border-none rounded text-white focus:outline-none focus:ring-1 focus:ring-white/50',
        isTitle ? 'h-5 text-xs font-bold' : 'h-4 text-[10px]',
        className
      )}
      placeholder={placeholder}
    />
  ) : (
    <button
      onClick={() => setIsEditing(true)}
      className={cn(
        'text-left truncate hover:bg-white/10 px-1 rounded',
        isTitle ? 'text-white text-xs font-bold' : 'text-white/80 text-[10px]',
        className
      )}
    >
      {value || placeholder}
    </button>
  );
};