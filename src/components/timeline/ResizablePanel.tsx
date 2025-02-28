import React, { useState, useEffect, useCallback } from 'react';
import { GripHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ResizablePanelProps {
  children: React.ReactNode;
  minHeight?: number;
  maxHeight?: number;
  defaultHeight?: number;
  onResize?: (height: number) => void;
  className?: string;
}

export const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  minHeight = 200,
  maxHeight = window.innerHeight * 0.4,
  defaultHeight = 300,
  onResize,
  className
}) => {
  const [height, setHeight] = useState(defaultHeight);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = 'grabbing';
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const newHeight = Math.max(minHeight, Math.min(maxHeight, e.clientY));
    setHeight(newHeight);
    onResize?.(newHeight);
  }, [isResizing, minHeight, maxHeight, onResize]);

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

  return (
    <div 
      className={cn('relative', className)}
      style={{ 
        height: `${height}px`,
        transition: isResizing ? 'none' : 'height 0.3s ease-in-out'
      }}
    >
      <div className="h-full overflow-hidden">
        {children}
      </div>
      
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-2 cursor-grab active:cursor-grabbing',
          'hover:bg-gray-100 transition-colors group'
        )}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripHorizontal className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};