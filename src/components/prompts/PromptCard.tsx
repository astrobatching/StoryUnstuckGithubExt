import React, { useState } from 'react';
import { Edit, X, File, Send, Plus, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardContent } from '../ui/card';
import { PromptPreview } from './preview/PromptPreview';
import { cn } from '../../lib/utils';
import type { Prompt, PromptFile } from '../../types/prompts';

interface PromptCardProps {
  prompt: Prompt;
  onUpdate: (updates: Partial<Prompt>) => void;
  onDelete: () => void;
  onAddFile: (file: Omit<PromptFile, 'id' | 'createdAt'>) => void;
  onDeleteFile: (fileId: string) => void;
  onSendToChat?: (content: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onUpdate,
  onDelete,
  onAddFile,
  onDeleteFile,
  onSendToChat
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(prompt.title);
  const [editDetails, setEditDetails] = useState(prompt.details);
  const [editAction, setEditAction] = useState(prompt.action);

  const handleSave = () => {
    if (editTitle.trim() || editDetails.trim()) {
      onUpdate({
        title: editTitle.trim(),
        details: editDetails.trim(),
        action: editAction.trim()
      });
    }
    setIsEditing(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      onAddFile({
        name: file.name,
        type: file.name.endsWith('.pdf') ? 'pdf' : 'text',
        content
      });
    } catch (error) {
      console.error('Failed to read file:', error);
    }
  };

  const handleSendToChat = (content: string) => {
    if (onSendToChat) {
      onSendToChat(content);
    }
  };

  return (
    <>
      <Card 
        className={cn(
          "border-4 border-black hover:shadow-lg transition-all duration-200",
          "cursor-pointer group"
        )}
        onClick={() => !isEditing && setIsPreviewOpen(true)}
      >
        <CardHeader className="border-b-4 border-black p-3">
          <div className="flex items-center justify-between">
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex-1 p-2 border-2 border-black"
                placeholder="Prompt title..."
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h4 className="font-bold">{prompt.title}</h4>
            )}
            
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(!isEditing);
                }}
                className="h-8 w-8 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="h-8 w-8 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 space-y-4">
          {isEditing ? (
            <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
              <div>
                <label className="block font-bold mb-2">Details</label>
                <textarea
                  value={editDetails}
                  onChange={(e) => setEditDetails(e.target.value)}
                  className="w-full h-24 p-2 border-2 border-black font-mono text-sm"
                  placeholder="Prompt details..."
                />
              </div>
              <div>
                <label className="block font-bold mb-2">Action Steps</label>
                <textarea
                  value={editAction}
                  onChange={(e) => setEditAction(e.target.value)}
                  className="w-full h-24 p-2 border-2 border-black font-mono text-sm"
                  placeholder="What action should the writer take?"
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h5 className="font-bold mb-2">Details</h5>
                <p className="text-sm whitespace-pre-wrap font-mono line-clamp-3">{prompt.details}</p>
              </div>
              <div>
                <h5 className="font-bold mb-2">Action Steps</h5>
                <p className="text-sm whitespace-pre-wrap font-mono line-clamp-3">{prompt.action}</p>
              </div>
            </>
          )}

          {/* File Section */}
          <div className="border-t-2 border-black pt-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-bold">Files ({prompt.files.length})</h5>
              <label className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
                <input
                  type="file"
                  accept=".txt,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add File
                </Button>
              </label>
            </div>
            
            {prompt.files.length > 0 && (
              <div className="flex gap-2">
                {prompt.files.slice(0, 3).map(file => (
                  <div
                    key={file.id}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-50 border-2 border-black rounded text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <File className="h-3 w-3 text-gray-500" />
                    <span className="font-mono truncate max-w-[100px]">{file.name}</span>
                  </div>
                ))}
                {prompt.files.length > 3 && (
                  <div className="px-2 py-1 bg-gray-50 border-2 border-black rounded text-sm">
                    +{prompt.files.length - 3} more
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsPreviewOpen(true);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleSendToChat(`${prompt.details}\n\n${prompt.action}`);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Send className="h-4 w-4 mr-1" />
              Send to Chat
            </Button>
          </div>
        </CardContent>
      </Card>

      {isPreviewOpen && (
        <PromptPreview
          prompt={prompt}
          onClose={() => setIsPreviewOpen(false)}
          onEdit={() => {
            setIsPreviewOpen(false);
            setIsEditing(true);
          }}
          onSendToChat={handleSendToChat}
        />
      )}
    </>
  );
};