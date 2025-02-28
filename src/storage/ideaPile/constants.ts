import type { Column } from '../../types/ideapile';

export const STORAGE_KEY = 'idea_pile_data';

export const DEFAULT_COLUMNS: Column[] = [
  {
    id: 'inbox',
    title: 'Inbox',
    subtitle: 'New ideas and notes',
    color: 'bg-blue-500',
    items: []
  },
  {
    id: 'processing',
    title: 'Processing',
    subtitle: 'Being organized',
    color: 'bg-yellow-500',
    items: []
  },
  {
    id: 'organized',
    title: 'Organized',
    subtitle: 'Ready to use',
    color: 'bg-green-500',
    items: []
  }
];

// Add some sample items for testing
DEFAULT_COLUMNS[0].items = [
  {
    id: '1',
    title: 'Story Idea: The Last Echo',
    content: 'A mystery thriller about sound waves that carry memories...',
    type: 'note',
    createdAt: new Date('2024-01-15'),
    tags: ['thriller', 'sci-fi'],
    columnId: 'inbox'
  },
  {
    id: '2',
    title: 'Character Reference',
    content: 'https://unsplash.com/photos/example',
    type: 'image',
    createdAt: new Date('2024-01-16'),
    tags: ['character', 'reference'],
    columnId: 'inbox',
    metadata: {
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
    }
  }
];