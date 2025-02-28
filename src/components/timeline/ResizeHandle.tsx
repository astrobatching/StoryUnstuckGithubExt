import React, { useState, useCallback, useEffect } from 'react';
import { GripHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ResizeHandleProps {
  isCollapsed: boolean;
  onHeightChange: (height: number) => void;
  minHeight: number;
  maxHeight: number;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  isCollapsed,
  onHeightChange,
  minHeight,
  maxHeight
}) => {
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = 'ns-resize';
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    const newHeight = Math.max(minHeight, Math.min(maxHeight, e.clientY));
    onHeightChange(newHeight);
  }, [isResizing, minHeight, maxHeight, onHeightChange]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  if (isCollapsed) return null;

  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 right-0 h-4 cursor-ns-resize",
        "hover:bg-gray-100 transition-colors group",
        "border-t-4 border-black",
        isResizing && "select-none"
      )}
      onMouseDown={handleMouseDown}
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripHorizontal className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};