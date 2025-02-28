import React, { useState } from 'react';
import { Copy, Download, X, Grip, SplitSquareHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useTimelineStore } from '../../store/timelineStore';

interface TextSplitterProps {
  onClose: () => void;
}

export const TextSplitter: React.FC<TextSplitterProps> = ({ onClose }) => {
  const [text, setText] = useState('');
  const [cards, setCards] = useState<Array<{ id: string; content: string }>>([]);
  const { addCard } = useTimelineStore();

  const handleSplit = () => {
    // Split text into cards based on different patterns
    const chunks = text
      .split(/(?:\r?\n){2,}/) // Split on multiple newlines
      .flatMap(chunk => {
        // Handle bullet points and numbered lists
        if (chunk.match(/^[•\-\*\d\.]|\n[•\-\*\d\.]/m)) {
          return chunk
            .split(/\n(?=[•\-\*\d\.])/)
            .map(item => item.replace(/^[•\-\*\d\.]\s*/, ''));
        }
        // Handle long paragraphs
        if (chunk.length > 200) {
          return chunk
            .match(/(?:[^.!?]+[.!?]+){1,2}/g) // Split into 1-2 sentence chunks
            ?.map(s => s.trim()) || [chunk];
        }
        return [chunk];
      })
      .filter(chunk => chunk.trim())
      .map(content => ({
        id: Date.now().toString() + Math.random(),
        content: content.trim()
      }));

    setCards(chunks);
  };

  const handleExport = () => {
    const csv = cards.map(card => `"${card.content.replace(/"/g, '""')}"`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat-cards.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCreateCards = () => {
    cards.forEach(card => {
      addCard({
        content: card.content,
        source: 'chat',
        color: 'white'
      });
    });
    onClose();
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <SplitSquareHorizontal className="h-4 w-4 text-gray-500" />
          <h3 className="font-bold">Text to Cards</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 p-3 border-4 border-black resize-none mb-4 font-mono text-sm"
        placeholder="Paste your text here..."
      />

      <div className="flex gap-2 mb-4">
        <Button onClick={handleSplit}>Split Text</Button>
        {cards.length > 0 && (
          <>
            <Button onClick={handleCreateCards}>
              Create Cards
            </Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </>
        )}
      </div>

      {cards.length > 0 && (
        <div className="space-y-2 overflow-y-auto">
          {cards.map((card) => (
            <div
              key={card.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/json', JSON.stringify({
                  type: 'chat-card',
                  content: card.content,
                  id: card.id
                }));
                e.currentTarget.classList.add('opacity-50');
              }}
              onDragEnd={(e) => {
                e.currentTarget.classList.remove('opacity-50');
              }}
              className={cn(
                'p-3 border-2 border-black bg-white',
                'flex items-start gap-2 cursor-move group',
                'hover:shadow-md transition-all duration-200'
              )}
            >
              <Grip className="h-4 w-4 mt-1 flex-shrink-0 text-gray-400" />
              <p className="text-sm flex-1 font-mono">{card.content}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(card.content)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};