import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Grip, Edit, X, Plus, Palette } from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';

interface StoryBlockProps {
  block: {
    id: string;
    title: string;
    color: string;
    sections: Array<{
      id: string;
      title: string;
      content: string;
    }>;
  };
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateBlock: (updates: { title?: string; color?: string }) => void;
  onDelete: () => void;
  onAddSection: () => void;
  onUpdateSection: (sectionId: string, updates: { title?: string; content?: string }) => void;
  onDeleteSection: (sectionId: string) => void;
}

const colorOptions = [
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Red', value: 'bg-red-500' },
  { name: 'Green', value: 'bg-green-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Yellow', value: 'bg-yellow-500' },
  { name: 'Cyan', value: 'bg-[#00FFF0]' }
];

export const StoryBlock: React.FC<StoryBlockProps> = ({
  block,
  isExpanded,
  onToggleExpand,
  onUpdateBlock,
  onDelete,
  onAddSection,
  onUpdateSection,
  onDeleteSection
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(block.title);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editSectionTitle, setEditSectionTitle] = useState('');

  const handleTitleSave = () => {
    if (editTitle.trim() && editTitle.trim() !== block.title) {
      onUpdateBlock({ title: editTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleSectionTitleEdit = (section: { id: string; title: string }) => {
    setEditingSectionId(section.id);
    setEditSectionTitle(section.title);
  };

  const handleSectionTitleSave = (sectionId: string) => {
    if (editSectionTitle.trim()) {
      onUpdateSection(sectionId, { title: editSectionTitle.trim() });
    }
    setEditingSectionId(null);
  };

  return (
    <div className="border-4 border-black">
      <div className={cn(block.color, "border-b-4 border-black")}>
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
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
                    setEditTitle(block.title);
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
              <h3 className="font-bold text-lg flex-1 text-white">{block.title}</h3>
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
                    <div className="absolute right-0 top-full mt-1 bg-white border-2 border-black rounded shadow-lg z-50">
                      <div className="grid grid-cols-2 gap-1 p-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            className={`${color.value} w-12 h-6 rounded hover:opacity-90 transition-opacity`}
                            onClick={() => {
                              onUpdateBlock({ color: color.value });
                              setShowColorPicker(false);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
        <div className="p-4 space-y-4">
          {block.sections.map((section) => (
            <div key={section.id} className="space-y-2">
              <div className="flex items-center justify-between group">
                {editingSectionId === section.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editSectionTitle}
                      onChange={(e) => setEditSectionTitle(e.target.value)}
                      className="flex-1 p-2 border-2 border-black rounded"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSectionTitleSave(section.id);
                        if (e.key === 'Escape') {
                          setEditingSectionId(null);
                        }
                      }}
                      onBlur={() => handleSectionTitleSave(section.id)}
                    />
                  </div>
                ) : (
                  <div className="flex-1 flex items-center gap-2">
                    <h4 className="font-bold flex-1">{section.title}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSectionTitleEdit(section)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteSection(section.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <textarea
                value={section.content}
                onChange={(e) => onUpdateSection(section.id, { content: e.target.value })}
                className="w-full p-2 border-2 border-black text-sm font-mono"
                rows={3}
              />
            </div>
          ))}
          
          <Button
            variant="ghost"
            onClick={onAddSection}
            className="w-full border-2 border-black border-dashed hover:border-solid"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        </div>
      )}
    </div>
  );
};