import React, { useState } from 'react';
import { Grip, Edit, X, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface TaskCardProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  onAddComment: (taskId: string, content: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onUpdate,
  onDelete,
  onAddComment
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/task-id', task.id);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="border-2 border-black/20 hover:border-black bg-white group p-2 cursor-move"
    >
      <div className="flex items-start gap-2">
        <Grip className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={task.title}
              onChange={(e) => onUpdate(task.id, { title: e.target.value })}
              className="w-full bg-transparent border-none p-0 text-sm focus:outline-none focus:ring-0"
              autoFocus
            />
          ) : (
            <div className="text-sm font-medium">{task.title}</div>
          )}
          
          {isEditing && (
            <textarea
              value={task.content}
              onChange={(e) => onUpdate(task.id, { content: e.target.value })}
              className="w-full mt-2 p-2 border-2 border-black text-sm resize-none"
              rows={3}
              placeholder="Task description..."
            />
          )}
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-1"
          >
            <MessageSquare className="h-4 w-4" />
            {task.comments.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {task.comments.length}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-1"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showComments && (
        <div className="mt-2 space-y-2 border-t-2 border-black/10 pt-2">
          {task.comments.map(comment => (
            <div key={comment.id} className="text-sm bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-500">{comment.author} • {new Date(comment.timestamp).toLocaleString()}</div>
              <div>{comment.content}</div>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 text-sm p-1 border-2 border-black"
              placeholder="Add comment..."
            />
            <Button
              size="sm"
              onClick={() => {
                if (newComment.trim()) {
                  onAddComment(task.id, newComment);
                  setNewComment('');
                }
              }}
            >
              Add
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};