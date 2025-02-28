import React, { useState } from 'react';
import { X, Edit, Copy, Send, FileText } from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';
import type { Prompt } from '../../../types/prompts';

interface PromptPreviewProps {
  prompt: Prompt;
  onClose: () => void;
  onEdit: () => void;
  onSendToChat: (content: string) => void;
}

export const PromptPreview: React.FC<PromptPreviewProps> = ({
  prompt,
  onClose,
  onEdit,
  onSendToChat
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSendToChat = () => {
    let content = `${prompt.details}\n\n${prompt.action}`;
    
    // If a file is selected, append its content
    if (selectedFile) {
      const file = prompt.files.find(f => f.id === selectedFile);
      if (file) {
        content += `\n\nFile: ${file.name}\n${file.content}`;
      }
    }
    
    onSendToChat(content);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-4 border-black">
          <h2 className="text-xl font-bold">{prompt.title}</h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="hover:bg-gray-100"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-2 gap-6 p-6">
          <div className="space-y-6">
            {/* Details Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(prompt.details)}
                  className="text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className={cn(
                "p-4 bg-gray-50 rounded-lg border-2 border-black",
                "font-mono text-sm whitespace-pre-wrap"
              )}>
                {prompt.details}
              </div>
            </div>

            {/* Action Steps Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">Action Steps</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(prompt.action)}
                  className="text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className={cn(
                "p-4 bg-gray-50 rounded-lg border-2 border-black",
                "font-mono text-sm whitespace-pre-wrap"
              )}>
                {prompt.action}
              </div>
            </div>
          </div>

          {/* Files Section */}
          <div>
            <h3 className="font-bold mb-4">Files</h3>
            <div className="space-y-2">
              {prompt.files.map(file => (
                <div
                  key={file.id}
                  className={cn(
                    "p-4 border-2 border-black rounded-lg cursor-pointer",
                    "hover:bg-gray-50 transition-colors",
                    selectedFile === file.id && "bg-gray-100"
                  )}
                  onClick={() => setSelectedFile(file.id === selectedFile ? null : file.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{file.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(file.content);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  {selectedFile === file.id && (
                    <div className="mt-2 p-2 bg-white border border-gray-200 rounded font-mono text-sm">
                      {file.content.slice(0, 200)}
                      {file.content.length > 200 && '...'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t-4 border-black bg-gray-50">
          <Button
            variant="ghost"
            onClick={() => copyToClipboard(`${prompt.details}\n\n${prompt.action}`)}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy All
          </Button>
          <Button onClick={handleSendToChat}>
            <Send className="h-4 w-4 mr-2" />
            Send to Chat
          </Button>
        </div>
      </div>
    </div>
  );
};