# Idea Pile & Prompts Workflow Specification

## 1. Database Schema

```sql
-- Prompt Categories
CREATE TABLE prompt_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Writing Prompts
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES prompt_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  action_steps TEXT[],
  tags TEXT[],
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prompt Responses
CREATE TABLE prompt_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## 2. Component Structure

```typescript
// Core Components
interface IdeaPileComponents {
  // Layout
  IdeaPileLayout: {
    props: {
      children: React.ReactNode;
      sidebarContent?: React.ReactNode;
    }
  };

  // Navigation
  CategoryList: {
    props: {
      categories: Category[];
      activeId: string;
      onSelect: (id: string) => void;
    }
  };

  // Content
  PromptGrid: {
    props: {
      prompts: Prompt[];
      layout: 'grid' | 'list';
      onPromptSelect: (id: string) => void;
    }
  };

  // Editor
  PromptEditor: {
    props: {
      prompt?: Prompt;
      onSave: (data: PromptData) => void;
      onCancel: () => void;
    }
  };
}

// Types
interface Category {
  id: string;
  title: string;
  description?: string;
  color: string;
  promptCount: number;
}

interface Prompt {
  id: string;
  title: string;
  content: string;
  actionSteps: string[];
  tags: string[];
  categoryId: string;
}

interface PromptData {
  title: string;
  content: string;
  actionSteps: string[];
  tags: string[];
  categoryId: string;
}
```

## 3. User Workflows

### Creating a New Prompt Category

1. User clicks "Add Category" button
2. Modal opens with form:
   - Title (required)
   - Description
   - Color picker
3. On submit:
   - Validate inputs
   - Create category in database
   - Update UI optimistically
   - Show success/error toast

### Adding a New Prompt

1. User clicks "Add Prompt" in category
2. Prompt editor opens with:
   - Title field
   - Content editor (rich text)
   - Action steps list builder
   - Tag input
3. On save:
   - Validate all required fields
   - Save to database
   - Update category prompt count
   - Show success confirmation

### Working with Prompts

1. Viewing prompts:
   - Grid/List view toggle
   - Filter by tags
   - Search by title/content
   - Sort by date/title

2. Using a prompt:
   - Open prompt details
   - Follow action steps
   - Add response/notes
   - Mark complete/archive

3. Organizing prompts:
   - Drag between categories
   - Reorder within category
   - Bulk actions (delete, move, tag)

## 4. State Management

```typescript
interface IdeaPileState {
  // UI State
  view: {
    mode: 'grid' | 'list';
    selectedCategory: string | null;
    selectedPrompt: string | null;
    isEditing: boolean;
  };

  // Data
  categories: {
    items: Category[];
    loading: boolean;
    error: Error | null;
  };

  prompts: {
    byId: Record<string, Prompt>;
    byCategory: Record<string, string[]>;
    loading: boolean;
    error: Error | null;
  };

  // Filters
  filters: {
    search: string;
    tags: string[];
    sortBy: 'date' | 'title';
    sortDir: 'asc' | 'desc';
  };
}
```

## 5. API Endpoints

```typescript
interface IdeaPileApi {
  // Categories
  'GET /api/projects/:projectId/prompt-categories': {
    response: Category[];
  };
  'POST /api/projects/:projectId/prompt-categories': {
    body: CreateCategoryDto;
    response: Category;
  };

  // Prompts
  'GET /api/categories/:categoryId/prompts': {
    response: Prompt[];
  };
  'POST /api/categories/:categoryId/prompts': {
    body: CreatePromptDto;
    response: Prompt;
  };
  'PUT /api/prompts/:promptId': {
    body: UpdatePromptDto;
    response: Prompt;
  };

  // Responses
  'POST /api/prompts/:promptId/responses': {
    body: CreateResponseDto;
    response: PromptResponse;
  };
}
```

## 6. Event Handling

```typescript
interface IdeaPileEvents {
  // Category Events
  onCategoryCreate: (data: CreateCategoryDto) => Promise<void>;
  onCategoryUpdate: (id: string, data: UpdateCategoryDto) => Promise<void>;
  onCategoryDelete: (id: string) => Promise<void>;
  onCategoryReorder: (ids: string[]) => Promise<void>;

  // Prompt Events
  onPromptCreate: (data: CreatePromptDto) => Promise<void>;
  onPromptUpdate: (id: string, data: UpdatePromptDto) => Promise<void>;
  onPromptDelete: (id: string) => Promise<void>;
  onPromptMove: (id: string, targetCategoryId: string) => Promise<void>;

  // Response Events
  onResponseCreate: (promptId: string, data: CreateResponseDto) => Promise<void>;
  onResponseUpdate: (id: string, data: UpdateResponseDto) => Promise<void>;
}
```

## 7. Storage Integration

```typescript
interface IdeaPileStorage {
  // Prompt attachments
  attachments: {
    maxSize: number; // 5MB
    allowedTypes: string[]; // ['image/*', 'application/pdf']
    path: string; // 'prompts/{promptId}/attachments'
  };

  // Response media
  responseMedia: {
    maxSize: number; // 10MB
    allowedTypes: string[]; // ['image/*', 'audio/*']
    path: string; // 'responses/{responseId}/media'
  };
}
```

## 8. Analytics Events

```typescript
interface IdeaPileAnalytics {
  // Category events
  'category:create': { title: string };
  'category:update': { id: string; changes: string[] };
  'category:delete': { id: string; promptCount: number };

  // Prompt events
  'prompt:create': { categoryId: string };
  'prompt:edit': { id: string };
  'prompt:move': { from: string; to: string };
  'prompt:complete': { id: string; timeSpent: number };

  // Response events
  'response:create': { promptId: string; wordCount: number };
  'response:update': { id: string; changeType: string };
}
```

## 9. Error Handling

```typescript
interface IdeaPileErrors {
  // Validation errors
  CategoryValidationError: {
    code: 'CATEGORY_VALIDATION';
    field: string;
    message: string;
  };

  PromptValidationError: {
    code: 'PROMPT_VALIDATION';
    field: string;
    message: string;
  };

  // Storage errors
  AttachmentError: {
    code: 'ATTACHMENT_ERROR';
    type: 'size' | 'type' | 'upload';
    message: string;
  };

  // API errors
  ApiError: {
    code: 'API_ERROR';
    status: number;
    message: string;
  };
}
```