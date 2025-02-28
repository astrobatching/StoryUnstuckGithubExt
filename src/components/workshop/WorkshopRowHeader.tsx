import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Edit, X, Palette } from 'lucide-react';

interface WorkshopRowHeaderProps {
  title: string;
  color: string;
  guide: string;
  onTitleChange: (newTitle: string) => void;
  onGuideChange: (newGuide: string) => void;
  onColorChange: (newColor: string) => void;
}

const colorOptions = [
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Red', value: 'bg-red-500' },
  { name: 'Yellow', value: 'bg-yellow-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Green', value: 'bg-green-500' },
  { name: 'Gray', value: 'bg-gray-500' }
];

export const WorkshopRowHeader: React.FC<WorkshopRowHeaderProps> = ({
  title,
  color,
  guide,
  onTitleChange,
  onGuideChange,
  onColorChange,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingGuide, setIsEditingGuide] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editGuide, setEditGuide] = useState(guide);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const guideInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
    if (isEditingGuide && guideInputRef.current) {
      guideInputRef.current.focus();
    }
  }, [isEditingTitle, isEditingGuide]);

  const handleSaveTitle = () => {
    if (editTitle.trim() !== title) {
      onTitleChange(editTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleSaveGuide = () => {
    if (editGuide.trim() !== guide) {
      onGuideChange(editGuide.trim());
    }
    setIsEditingGuide(false);
  };

  return (
    <div className={`${color} p-4 border-b-4 border-black group relative`}>
      <div className="flex justify-between items-start text-white">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') {
                    setEditTitle(title);
                    setIsEditingTitle(false);
                  }
                }}
                className="w-full bg-white/10 border-none rounded px-2 py-1 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg font-bold"
                placeholder="Enter title..."
              />
            ) : (
              <>
                <h3 className="font-bold text-lg">{title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingTitle(true)}
                  className="opacity-0 group-hover:opacity-100 hover:bg-white/20"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {isEditingGuide ? (
            <input
              ref={guideInputRef}
              type="text"
              value={editGuide}
              onChange={(e) => setEditGuide(e.target.value)}
              onBlur={handleSaveGuide}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveGuide();
                if (e.key === 'Escape') {
                  setEditGuide(guide);
                  setIsEditingGuide(false);
                }
              }}
              className="w-full bg-white/10 border-none rounded px-2 py-1 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
              placeholder="Enter guide text..."
            />
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-sm opacity-90">{guide}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingGuide(true)}
                className="opacity-0 group-hover:opacity-100 hover:bg-white/20"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="opacity-0 group-hover:opacity-100 hover:bg-white/20"
          >
            <Palette className="h-4 w-4" />
          </Button>

          {showColorPicker && (
            <div className="absolute right-0 top-full mt-1 bg-white border-2 border-black rounded shadow-lg z-50">
              <div className="grid grid-cols-2 gap-1 p-2">
                {colorOptions.map((colorOption) => (
                  <button
                    key={colorOption.value}
                    className={`${colorOption.value} w-12 h-6 rounded hover:opacity-90 transition-opacity`}
                    onClick={() => {
                      onColorChange(colorOption.value);
                      setShowColorPicker(false);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};