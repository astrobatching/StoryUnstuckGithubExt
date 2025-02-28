export interface TaskComment {
  id: string;
  content: string;
  timestamp: number;
  author: string;
}

export interface Task {
  id: string;
  title: string;
  content: string;
  comments: TaskComment[];
  labels: string[];
  columnId: string;
}

export interface TaskColumn {
  id: string;
  title: string;
  color: string;
}