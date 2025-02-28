export type ContentType = 'note' | 'image' | 'voice' | 'link' | 'reference';
export type ViewMode = 'list' | 'grid';
export type ItemStatus = 'unprocessed' | 'inuse' | 'archived';

export interface IdeaItem {
  id: string;
  title: string;
  content: string;
  type: ContentType;
  category: 'capture' | 'inspiration' | 'reference';
  status: ItemStatus;
  createdAt: Date;
  updatedAt: Date;
  source?: string;
  tags: string[];
  projectRefs: Array<{
    projectId: string;
    projectName: string;
    usage: string;
    dateUsed: Date;
  }>;
  metadata?: {
    duration?: string;
    imageUrl?: string;
    linkUrl?: string;
    transcription?: string;
    originalContext?: string;
  };
}

export interface Column {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  items: IdeaItem[];
}

export interface IdeaPileState {
  items: IdeaItem[];
  viewMode: ViewMode;
  filters: {
    category?: string;
    status?: ItemStatus;
    tags?: string[];
    projects?: string[];
    search?: string;
  };
  sort: {
    field: 'createdAt' | 'updatedAt' | 'title' | 'usage';
    direction: 'asc' | 'desc';
  };
}