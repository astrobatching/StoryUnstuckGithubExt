import React, { createContext, useContext, useState } from 'react';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
}

interface Position {
  x: number;
  y: number;
}

interface ChatContextType {
  messages: Message[];
  addMessage: (content: string, type: 'user' | 'assistant') => void;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  selectedPersona: string;
  setSelectedPersona: (value: string) => void;
  position: Position;
  setPosition: (position: Position) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'How can I help with your story today?',
      type: 'assistant',
    },
  ]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [selectedPersona, setSelectedPersona] = useState('developer');
  const [position, setPosition] = useState<Position>({ x: window.innerWidth - 340, y: 20 });

  const addMessage = (content: string, type: 'user' | 'assistant') => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      type,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        isCollapsed,
        setIsCollapsed,
        selectedModel,
        setSelectedModel,
        selectedPersona,
        setSelectedPersona,
        position,
        setPosition,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};