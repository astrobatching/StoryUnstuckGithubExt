import React from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { TaskCard } from './TaskCard';
import { cn } from '../../lib/utils';

interface TaskColumnProps {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
  onAddTask: (columnId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, targetColumnId: string) => void;
  onAddComment: (taskId: string, content: string) => void;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
  id,
  title,
  color,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onMoveTask,
  onAddComment
}) => {
  return (
    <div className="w-80 flex-shrink-0 flex flex-col border-4 border-black bg-white">
      <div className={cn(
        'h-8 flex items-center justify-between px-2',
        color,
        'border-b-4 border-black'
      )}>
        <h3 className="font-mono text-xs font-bold text-white">{title}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddTask(id)}
          className="h-6 w-6 p-1 hover:bg-white/20"
        >
          <Plus className="h-3 w-3 text-white" />
        </Button>
      </div>

      <div
        className="flex-1 p-2 space-y-2 overflow-y-auto"
        onDragOver={(e) => {
          if (e.dataTransfer.types.includes('text/task-id')) {
            e.preventDefault();
            e.currentTarget.classList.add('bg-gray-100/50');
          }
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove('bg-gray-100/50');
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('bg-gray-100/50');
          const taskId = e.dataTransfer.getData('text/task-id');
          if (taskId) {
            onMoveTask(taskId, id);
          }
        }}
      >
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
            onAddComment={onAddComment}
          />
        ))}
      </div>
    </div>
  );
};