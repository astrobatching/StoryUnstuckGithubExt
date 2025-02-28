import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, Edit, X, Palette } from 'lucide-react';
import { Button } from '../ui/button';
import { PromptCard } from './PromptCard';
import { cn } from '../../lib/utils';
import type { Prompt, PromptFile } from '../../types/prompts';

interface PromptSectionProps {
  id: string;
  title: string;
  color?: string;
  prompts: Prompt[];
  onAddPrompt: (sectionId: string) => void;
  onUpdatePrompt: (promptId: string, updates: Partial<Prompt>) => void;
  onDeletePrompt: (promptId: string) => void;
  onUpdateSection: (id: string, updates: { title?: string; color?: string }) => void;
  onDelete: () => void;
  onAddFile: (promptId: string, file: Omit<PromptFile, 'id' | 'createdAt'>) => void;
  onDeleteFile: (promptId: string, fileId: string) => void;
  onSendToChat: (content: string) => void;
}

const colorOptions = [
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Red', value: 'bg-red-500' },
  { name: 'Green', value: 'bg-green-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Yellow', value: 'bg-yellow-500' },
  { name: 'Cyan', value: 'bg-[#00FFF0]' }
];

export const PromptSection: React.FC<PromptSectionProps> = ({
  id,
  title,
  color = 'bg-[#00FFF0]',
  prompts,
  onAddPrompt,
  onUpdatePrompt,
  onDeletePrompt,
  onUpdateSection,
  onDelete,
  onAddFile,
  onDeleteFile,
  onSendToChat
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleTitleSave = () => {
    if (editTitle.trim() && editTitle.trim() !== title) {
      onUpdateSection(id, { title: editTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleColorChange = (newColor: string) => {
    onUpdateSection(id, { color: newColor });
    setShowColorPicker(false);
  };

  return (
    <div className="border-4 border-black">
      <div className={cn(color, "border-b-4 border-black")}>
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="hover:bg-white/10 text-white"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          
          {isEditingTitle ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex-1 p-2 border-2 border-black bg-white/90 text-black"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSave();
                  if (e.key === 'Escape') {
                    setEditTitle(title);
                    setIsEditingTitle(false);
                  }
                }}
                onBlur={handleTitleSave}
              />
              <Button 
                size="sm" 
                onClick={handleTitleSave}
                className="bg-black text-white hover:bg-black/80"
              >
                Save
              </Button>
            </div>
          ) : (
            <>
              <h3 className="font-bold text-lg flex-1 text-white">{title}</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingTitle(true)}
                  className="hover:bg-white/10 text-white"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="hover:bg-white/10 text-white"
                  >
                    <Palette className="h-4 w-4" />
                  </Button>
                  {showColorPicker && (
                    <div 
                      className="absolute right-0 top-full mt-1 bg-white border-2 border-black rounded shadow-lg z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="grid grid-cols-2 gap-1 p-2">
                        {colorOptions.map((colorOption) => (
                          <button
                            key={colorOption.value}
                            className={`${colorOption.value} w-12 h-6 rounded hover:opacity-90 transition-opacity`}
                            onClick={() => handleColorChange(colorOption.value)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddPrompt(id)}
                  className="hover:bg-white/10 text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="hover:bg-white/10 text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="grid grid-cols-3 gap-4 p-4">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onUpdate={(updates) => onUpdatePrompt(prompt.id, updates)}
              onDelete={() => onDeletePrompt(prompt.id)}
              onAddFile={(file) => onAddFile(prompt.id, file)}
              onDeleteFile={(fileId) => onDeleteFile(prompt.id, fileId)}
              onSendToChat={onSendToChat}
            />
          ))}
        </div>
      )}
    </div>
  );
};