import React, { useState } from 'react';
import { Minimize2, MessageSquare, SplitSquareHorizontal, Move, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardContent } from '../ui/card';
import { ModelSelector } from './ModelSelector';
import { PersonaSelector } from './PersonaSelector';
import { TextSplitter } from './TextSplitter';
import { ChatMessage } from './ChatMessage';
import { useChat } from '../../contexts/ChatContext';
import { useTimelineStore } from '../../store/timelineStore';
import { cn } from '../../lib/utils';

export const ChatWindow: React.FC = () => {
  const {
    messages,
    addMessage,
    isCollapsed,
    setIsCollapsed,
    selectedModel,
    setSelectedModel,
    selectedPersona,
    setSelectedPersona,
    position,
    setPosition
  } = useChat();

  const { deleteAllCards } = useTimelineStore();
  
  const [input, setInput] = useState('');
  const [showTextSplitter, setShowTextSplitter] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    e.currentTarget.setAttribute('data-offset-x', offsetX.toString());
    e.currentTarget.setAttribute('data-offset-y', offsetY.toString());
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const offsetX = parseInt(e.currentTarget.getAttribute('data-offset-x') || '0');
    const offsetY = parseInt(e.currentTarget.getAttribute('data-offset-y') || '0');
    
    setPosition({
      x: e.clientX - offsetX,
      y: e.clientY - offsetY
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    addMessage(input, 'user');
    setInput('');
  };

  const handleDeleteAllCards = () => {
    if (window.confirm('Are you sure you want to delete all cards from this session?')) {
      deleteAllCards();
    }
  };

  if (isCollapsed) {
    return (
      <Button
        className="fixed bottom-4 right-4 shadow-lg rounded-full p-4 z-50"
        onClick={() => setIsCollapsed(false)}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div 
      className="fixed z-50"
      style={{ 
        left: position.x,
        top: position.y,
        width: '320px'
      }}
    >
      <Card className={cn(
        "border-4 border-black h-[600px] flex flex-col",
        "transition-all duration-300 ease-in-out",
        isDragging && "opacity-75"
      )}>
        <CardHeader 
          className="border-b-4 border-black p-3 cursor-move"
          onMouseDown={handleDragStart}
          onMouseMove={handleDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Move className="h-4 w-4 text-gray-400" />
              <h3 className="font-bold">AI Assistant</h3>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteAllCards}
                className="h-8 w-8 p-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                title="Delete all cards"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTextSplitter(!showTextSplitter)}
                className="h-8 w-8 p-1"
              >
                <SplitSquareHorizontal className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(true)}
                className="h-8 w-8 p-1"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <ModelSelector
              value={selectedModel}
              onChange={setSelectedModel}
            />
            <PersonaSelector
              value={selectedPersona}
              onChange={setSelectedPersona}
            />
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
          {showTextSplitter ? (
            <TextSplitter onClose={() => setShowTextSplitter(false)} />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    id={message.id}
                    content={message.content}
                    type={message.type}
                  />
                ))}
              </div>

              <div className="border-t-4 border-black p-4">
                <div className="flex gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 p-3 border-4 border-black resize-none h-32 font-mono text-sm"
                    placeholder="Ask me anything about your story..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <Button onClick={handleSend} className="self-end">
                    Send
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};