import React, { useState } from 'react';
import { MessageCircle, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';
import type { Note } from '../../../types/write';

interface SceneNotesProps {
  notes: Note[];
  onAddNote: (content: string) => void;
}

export const SceneNotes: React.FC<SceneNotesProps> = ({
  notes,
  onAddNote
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddNote(newComment);
      setNewComment('');
    }
  };

  return (
    <div className={cn(
      'border-l-4 border-black flex flex-col',
      'transition-all duration-300',
      isCollapsed ? 'w-12' : 'w-96'
    )}>
      {/* Header */}
      <Button
        variant="ghost"
        className="p-4 border-b-4 border-black flex items-center justify-between"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {!isCollapsed && (
          <span className="font-mono font-bold flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            NOTES & COMMENTS
          </span>
        )}
        {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>

      {/* Notes Content */}
      {!isCollapsed && (
        <div className="flex-1 flex flex-col p-4">
          {/* Notes List */}
          <div className="flex-1 space-y-4">
            {notes.map(note => (
              <div key={note.id} className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-mono">
                  {note.user[0]}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="font-mono text-sm font-bold mb-1">{note.user}</div>
                    <p className="font-mono text-sm">{note.content}</p>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{note.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment Input */}
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 p-2 border-2 border-black font-mono text-sm"
              placeholder="Add a comment..."
            />
            <Button 
              className="border-2 border-black"
              onClick={handleAddComment}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};