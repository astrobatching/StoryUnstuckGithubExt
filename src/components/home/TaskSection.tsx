import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

interface Task {
  id: string;
  title: string;
  content: string;
  projectId: string;
  phase: 'ideation' | 'refine' | 'systematize' | 'implement';
  dueDate: Date | null;
}

interface TaskSectionProps {
  title: string;
  color: string;
  tasks: Task[];
}

export const TaskSection: React.FC<TaskSectionProps> = ({
  title,
  color,
  tasks
}) => {
  return (
    <Card className="border-4 border-black">
      <CardHeader className={cn("border-b-4 border-black", color)}>
        <h3 className="font-bold text-white">{title}</h3>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          {tasks.map(task => (
            <div key={task.id} className="p-2 border-2 border-black">
              <h4 className="font-bold">{task.title}</h4>
              <p className="text-sm text-gray-600">{task.content}</p>
              {task.dueDate && (
                <div className="text-xs text-gray-500 mt-1">
                  Due: {task.dueDate.toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};