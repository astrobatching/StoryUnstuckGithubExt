import { Home, MessageSquareText, LayoutPanelTop, GitBranch, Pen, BookOpen, ListTodo, Lightbulb } from 'lucide-react';

export const navigationItems = [
  {
    id: 'workshop',
    label: 'Workshop',
    icon: MessageSquareText,
  },
  {
    id: 'episodes',
    label: 'Episodes',
    icon: LayoutPanelTop,
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: GitBranch,
  },
  {
    id: 'write',
    label: 'Write',
    icon: Pen,
  },
  {
    id: 'prompts',
    label: 'Prompts',
    icon: BookOpen,
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: ListTodo,
  },
  {
    id: 'ideapile',
    label: 'Idea Pile',
    icon: Lightbulb,
  },
] as const;

export type ViewType = typeof navigationItems[number]['id'] | 'home';