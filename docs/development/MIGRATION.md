# Comprehensive Migration Guide

## 1. Infrastructure Setup

### Database (Supabase)
```sql
-- Core tables
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('tv-30', 'tv-60', 'film')),
  status TEXT NOT NULL DEFAULT 'draft',
  template TEXT NOT NULL DEFAULT 'classic',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

CREATE TABLE episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, number)
);

CREATE TABLE acts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  color TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  act_id UUID NOT NULL REFERENCES acts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Timeline tables
CREATE TABLE storylines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE storyline_episodes (
  storyline_id UUID NOT NULL REFERENCES storylines(id) ON DELETE CASCADE,
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY (storyline_id, episode_id)
);

-- Workshop tables
CREATE TABLE workshop_quadrants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE workshop_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quadrant_id UUID NOT NULL REFERENCES workshop_quadrants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Idea Pile tables
CREATE TABLE idea_columns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  color TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE idea_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  column_id UUID NOT NULL REFERENCES idea_columns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT NOT NULL,
  metadata JSONB,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE acts ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE storylines ENABLE ROW LEVEL SECURITY;
ALTER TABLE storyline_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_quadrants ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_cards ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can access own projects"
  ON projects FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can access project episodes"
  ON episodes FOR ALL
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = episodes.project_id
    AND projects.user_id = auth.uid()
  ));

-- Add similar policies for other tables
```

### API Endpoints

```typescript
// src/api/types.ts
export interface ApiEndpoints {
  // Projects
  'GET /api/projects': {
    response: Project[];
  };
  'POST /api/projects': {
    body: CreateProjectDto;
    response: Project;
  };
  'GET /api/projects/:id': {
    params: { id: string };
    response: ProjectDetails;
  };
  
  // Episodes
  'GET /api/projects/:projectId/episodes': {
    params: { projectId: string };
    response: Episode[];
  };
  'POST /api/projects/:projectId/episodes': {
    params: { projectId: string };
    body: CreateEpisodeDto;
    response: Episode;
  };
  
  // Acts
  'GET /api/episodes/:episodeId/acts': {
    params: { episodeId: string };
    response: Act[];
  };
  'POST /api/episodes/:episodeId/acts': {
    params: { episodeId: string };
    body: CreateActDto;
    response: Act;
  };
  
  // Scenes
  'GET /api/acts/:actId/scenes': {
    params: { actId: string };
    response: Scene[];
  };
  'POST /api/acts/:actId/scenes': {
    params: { actId: string };
    body: CreateSceneDto;
    response: Scene;
  };
  
  // Timeline
  'GET /api/projects/:projectId/storylines': {
    params: { projectId: string };
    response: Storyline[];
  };
  'POST /api/projects/:projectId/storylines': {
    params: { projectId: string };
    body: CreateStorylineDto;
    response: Storyline;
  };
  
  // Workshop
  'GET /api/projects/:projectId/workshop': {
    params: { projectId: string };
    response: WorkshopData;
  };
  'POST /api/workshop/quadrants/:quadrantId/cards': {
    params: { quadrantId: string };
    body: CreateCardDto;
    response: WorkshopCard;
  };
  
  // Idea Pile
  'GET /api/projects/:projectId/ideas': {
    params: { projectId: string };
    response: IdeaPileData;
  };
  'POST /api/ideas/columns/:columnId/cards': {
    params: { columnId: string };
    body: CreateIdeaCardDto;
    response: IdeaCard;
  };
}
```

### Storage Requirements

```typescript
// src/storage/types.ts
export interface StorageConfig {
  // Project assets
  assets: {
    maxSize: number; // 10MB
    allowedTypes: string[]; // ['image/*', 'audio/*']
    path: string; // 'projects/{projectId}/assets'
  };
  
  // Scene attachments
  attachments: {
    maxSize: number; // 5MB
    allowedTypes: string[]; // ['image/*', 'application/pdf']
    path: string; // 'projects/{projectId}/scenes/{sceneId}/attachments'
  };
  
  // Idea pile media
  ideaMedia: {
    maxSize: number; // 20MB
    allowedTypes: string[]; // ['image/*', 'audio/*', 'video/*']
    path: string; // 'projects/{projectId}/ideas/{ideaId}/media'
  }
}

// Storage buckets
export interface StorageBuckets {
  assets: 'story-unstuck-assets';
  attachments: 'story-unstuck-attachments';
  ideaMedia: 'story-unstuck-idea-media';
}
```

### State Management

```typescript
// src/state/types.ts
export interface AppState {
  // Current project
  project: {
    current: Project | null;
    loading: boolean;
    error: Error | null;
  };
  
  // Episodes view
  episodes: {
    items: Episode[];
    openEpisodes: Set<string>;
    activeEpisode: string | null;
  };
  
  // Timeline view
  timeline: {
    storylines: Storyline[];
    height: number;
    isCollapsed: boolean;
  };
  
  // Workshop view
  workshop: {
    quadrants: Quadrant[];
    expandedQuadrant: string | null;
  };
  
  // Idea pile view
  ideaPile: {
    columns: Column[];
    viewMode: 'list' | 'grid';
  };
}

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'story_unstuck_token',
  CURRENT_PROJECT: 'story_unstuck_project',
  UI_STATE: 'story_unstuck_ui',
  DRAFTS: 'story_unstuck_drafts'
} as const;
```

## 2. Implementation Plan

### Phase 1: Core Infrastructure
1. Set up Supabase project
2. Create database tables and policies
3. Configure storage buckets
4. Implement authentication
5. Create base API client

### Phase 2: Project Management
1. Project creation/selection
2. Basic navigation
3. Project settings
4. Template switching

### Phase 3: Episodes & Scenes
1. Episode management
2. Act structure
3. Scene editor
4. Drag and drop functionality

### Phase 4: Timeline & Workshop
1. Timeline visualization
2. Storyline management
3. Workshop quadrants
4. Card system

### Phase 5: Idea Management
1. Idea pile columns
2. Card creation/editing
3. Media attachments
4. Drag and drop

### Phase 6: Polish & Optimization
1. Error handling
2. Loading states
3. Offline support
4. Performance optimization

## 3. Testing Strategy

```typescript
// src/tests/setup.ts
import { setupServer } from 'msw/node';
import { supabase } from '../lib/supabase';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// Reset database between tests
beforeEach(async () => {
  await supabase.storage.emptyBucket('test-bucket');
  await supabase.rpc('reset_test_db');
});
```

### Test Categories
1. Unit tests for utilities and hooks
2. Component tests for UI elements
3. Integration tests for features
4. E2E tests for critical flows
5. Performance tests for data-heavy operations

## 4. Deployment Configuration

```typescript
// src/config/environment.ts
export const config = {
  development: {
    apiUrl: 'http://localhost:3000',
    supabaseUrl: process.env.VITE_SUPABASE_URL,
    supabaseKey: process.env.VITE_SUPABASE_KEY,
    storage: {
      maxSize: 50 * 1024 * 1024, // 50MB total
      maxFiles: 100
    }
  },
  production: {
    apiUrl: 'https://api.storyunstuck.com',
    supabaseUrl: process.env.VITE_SUPABASE_URL,
    supabaseKey: process.env.VITE_SUPABASE_KEY,
    storage: {
      maxSize: 1024 * 1024 * 1024, // 1GB total
      maxFiles: 1000
    }
  }
};
```

## 5. Monitoring & Analytics

```typescript
// src/lib/analytics.ts
export interface AnalyticsEvents {
  // User events
  'user:signup': { source: string };
  'user:login': { method: string };
  
  // Project events
  'project:create': { type: string };
  'project:open': { id: string };
  
  // Feature usage
  'timeline:toggle': { isCollapsed: boolean };
  'workshop:addCard': { quadrant: string };
  'ideaPile:moveCard': { from: string; to: string };
  
  // Errors
  'error:api': { endpoint: string; status: number };
  'error:storage': { operation: string; code: string };
}
```

## 6. Security Considerations

1. Data access
- Row Level Security (RLS) policies
- API endpoint authorization
- Storage bucket policies

2. Input validation
- API request validation
- File upload scanning
- Content sanitization

3. Error handling
- Secure error messages
- Rate limiting
- Request timeouts

4. Authentication
- Session management
- Token refresh
- Password policies