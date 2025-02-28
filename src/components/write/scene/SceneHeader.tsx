import React from 'react';
import { Hash, Plus, X } from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';

interface SceneHeaderProps {
  sceneId: string;
  title: string;
  tags: string[];
  onAddTag: () => void;
  onClose: () => void;
}

export const SceneHeader: React.FC<SceneHeaderProps> = ({
  sceneId,
  title,
  tags = [], // Add default empty array
  onAddTag,
  onClose
}) => {
  return (
    <div className="border-b-4 border-black p-4 bg-gray-50">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-mono text-xl font-bold">{title}</h2>
            <span className="px-2 py-1 bg-gray-200 text-sm font-mono rounded">Fountain</span>
          </div>
          <div className="flex gap-4 mt-2 items-center">
            <span className="font-mono text-sm text-gray-600">Scene {sceneId}</span>
            <div className="flex gap-2">
              {tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-gray-100 border-2 border-black font-mono text-sm flex items-center gap-1"
                >
                  <Hash className="h-3 w-3" />
                  {tag}
                </span>
              ))}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onAddTag}
                className="border-2 border-black"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClose}
          className="hover:bg-gray-200"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};