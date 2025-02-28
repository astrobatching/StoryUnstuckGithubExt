import React, { useState } from 'react';
import { TaskColumn } from './TaskColumn';
import type { Task, TaskColumn as TaskColumnType } from '../../types/task';

const defaultColumns: TaskColumnType[] = [
  { id: 'inbox', title: 'INBOX', color: 'bg-gray-500' },
  { id: 'ideation', title: 'IDEATION', color: 'bg-red-500' },
  { id: 'refine', title: 'REFINE', color: 'bg-blue-500' },
  { id: 'systemization', title: 'SYSTEMIZATION', color: 'bg-yellow-500' },
  { id: 'implementation', title: 'IMPLEMENTATION', color: 'bg-green-500' },
  { id: 'archive', title: 'ARCHIVE', color: 'bg-gray-700' }
];

export const TaskView: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = (columnId: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: 'New Task',
      content: '',
      comments: [],
      labels: [],
      columnId
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleMoveTask = (taskId: string, targetColumnId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, columnId: targetColumnId } : task
      )
    );
  };

  const handleAddComment = (taskId: string, content: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              comments: [
                ...task.comments,
                { 
                  id: Date.now().toString(), 
                  content, 
                  timestamp: Date.now(),
                  author: 'User'
                }
              ]
            }
          : task
      )
    );
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      <div className="flex-1 flex gap-4 p-4 overflow-x-auto">
        {defaultColumns.map(column => (
          <TaskColumn
            key={column.id}
            {...column}
            tasks={tasks.filter(task => task.columnId === column.id)}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onMoveTask={handleMoveTask}
            onAddComment={handleAddComment}
          />
        ))}
      </div>
    </div>
  );
};