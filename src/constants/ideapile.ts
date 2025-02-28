export const DEFAULT_COLUMNS = [
  {
    id: 'inbox',
    title: 'INBOX',
    subtitle: 'New & Unprocessed',
    color: 'bg-blue-500',
  },
  {
    id: 'active',
    title: 'ACTIVE',
    subtitle: 'In Development',
    color: 'bg-green-500',
  },
  {
    id: 'reference',
    title: 'REFERENCE',
    subtitle: 'Research & Resources',
    color: 'bg-purple-500',
  },
  {
    id: 'archive',
    title: 'ARCHIVE',
    subtitle: 'Completed & Stored',
    color: 'bg-gray-500',
  }
];

export const QUICK_TAGS = {
  type: ['#character', '#plot', '#dialogue', '#setting', '#research'],
  status: ['#draft', '#inuse', '#complete'],
  importance: ['#core', '#optional', '#explore']
};

export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'updatedAt', label: 'Last Modified' },
  { value: 'title', label: 'Title' },
  { value: 'usage', label: 'Usage Count' }
] as const;