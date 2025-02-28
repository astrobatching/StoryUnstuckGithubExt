# Story Prompts System Development Guide

## Overview

This guide covers the deployment and integration of the Story Prompts system, including:
- Story Overview component
- Custom Prompts with chat integration
- AI Chat with model selection and personas
- Supabase backend integration
- Netlify deployment

## 1. Project Structure

```
src/
├── components/
│   ├── prompts/
│   │   ├── overview/          # Story overview components
│   │   ├── preview/          # Prompt preview components
│   │   ├── PromptCard.tsx    # Individual prompt display
│   │   └── PromptSection.tsx # Prompt group container
│   └── chat/
│       ├── ChatWindow.tsx    # Main chat interface
│       ├── ModelSelector.tsx # AI model selection
│       └── PersonaSelector.tsx # Chat persona selection
├── hooks/
│   ├── prompts/
│   │   └── usePromptsState.ts # Prompt state management
│   └── chat/
│       └── useChatState.ts    # Chat state management
└── types/
    ├── prompts.ts            # Prompt-related types
    └── chat.ts               # Chat-related types
```

## 2. GitHub Repository Setup

1. Create a new repository:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <repository-url>
git push -u origin main
```

2. Configure branch protection:
   - Go to Settings > Branches
   - Add rule for `main` branch
   - Require pull request reviews
   - Require status checks to pass

3. Create development workflow:
```yaml
# .github/workflows/development.yml
name: Development

on:
  push:
    branches: [ develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
```

## 3. Supabase Integration

### Database Schema

```sql
-- prompts/schema.sql

-- Prompt Categories
CREATE TABLE prompt_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prompts
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES prompt_categories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  details TEXT NOT NULL,
  action_steps JSONB DEFAULT '[]'::jsonb,
  files JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE prompt_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own categories"
  ON prompt_categories
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own prompts"
  ON prompts
  FOR ALL
  USING (auth.uid() = user_id);
```

### API Client Setup

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Prompt-related queries
export const promptsApi = {
  async getCategories() {
    const { data, error } = await supabase
      .from('prompt_categories')
      .select('*')
      .order('position');
    if (error) throw error;
    return data;
  },

  async getPrompts(categoryId: string) {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('category_id', categoryId)
      .order('created_at');
    if (error) throw error;
    return data;
  },

  async createPrompt(prompt: Omit<Prompt, 'id'>) {
    const { data, error } = await supabase
      .from('prompts')
      .insert([prompt])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
```

## 4. Chat Integration

### OpenAI API Integration

```typescript
// src/lib/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

export const chatApi = {
  async sendMessage(content: string, model: string) {
    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content }],
    });
    return completion.choices[0].message;
  }
};
```

### Chat State Management

```typescript
// src/hooks/chat/useChatState.ts
import { create } from 'zustand';

interface ChatState {
  messages: Message[];
  model: string;
  persona: string;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  setModel: (model: string) => void;
  setPersona: (persona: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  model: 'gpt-4',
  persona: 'writer',
  addMessage: (content, role) =>
    set((state) => ({
      messages: [...state.messages, { id: Date.now(), content, role }]
    })),
  setModel: (model) => set({ model }),
  setPersona: (persona) => set({ persona })
}));
```

## 5. Netlify Deployment

1. Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Environment Variables:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - VITE_OPENAI_API_KEY

3. Deploy Command:
```bash
netlify deploy --prod
```

## 6. Development Workflow

1. Local Development:
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

2. Making Changes:
   - Create feature branch
   - Make changes
   - Run tests
   - Create pull request
   - Deploy to staging
   - Merge to main

3. Database Migrations:
```bash
# Create new migration
supabase migration new add_prompt_features

# Apply migrations
supabase db reset
```

## 7. API Endpoints

### Prompts API

```typescript
interface PromptsApi {
  // Categories
  'GET /api/categories': {
    response: Category[];
  };
  'POST /api/categories': {
    body: CreateCategoryDto;
    response: Category;
  };

  // Prompts
  'GET /api/categories/:id/prompts': {
    params: { id: string };
    response: Prompt[];
  };
  'POST /api/prompts': {
    body: CreatePromptDto;
    response: Prompt;
  };
  'PUT /api/prompts/:id': {
    params: { id: string };
    body: UpdatePromptDto;
    response: Prompt;
  };
}
```

### Chat API

```typescript
interface ChatApi {
  'POST /api/chat/messages': {
    body: {
      content: string;
      model: string;
      persona: string;
    };
    response: {
      id: string;
      content: string;
      role: 'assistant';
    };
  };
}
```

## 8. Testing Strategy

1. Unit Tests:
```typescript
// src/__tests__/prompts/PromptCard.test.tsx
import { render, fireEvent } from '@testing-library/react';
import { PromptCard } from '../../components/prompts/PromptCard';

describe('PromptCard', () => {
  it('renders prompt content', () => {
    const prompt = {
      id: '1',
      title: 'Test Prompt',
      content: 'Test content'
    };
    const { getByText } = render(<PromptCard prompt={prompt} />);
    expect(getByText('Test Prompt')).toBeInTheDocument();
  });
});
```

2. Integration Tests:
```typescript
// src/__tests__/integration/prompts.test.ts
import { promptsApi } from '../../lib/supabase';

describe('Prompts API', () => {
  it('creates and retrieves prompts', async () => {
    const category = await promptsApi.createCategory({
      title: 'Test Category'
    });
    const prompt = await promptsApi.createPrompt({
      categoryId: category.id,
      title: 'Test Prompt'
    });
    const prompts = await promptsApi.getPrompts(category.id);
    expect(prompts).toContainEqual(prompt);
  });
});
```

## 9. Error Handling

```typescript
// src/utils/error.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    // Handle specific API errors
    switch (error.code) {
      case 'auth/unauthorized':
        // Handle auth errors
        break;
      case 'prompts/not-found':
        // Handle not found errors
        break;
      default:
        // Handle other API errors
    }
  } else {
    // Handle unexpected errors
    console.error('Unexpected error:', error);
  }
}
```

## 10. Performance Optimization

1. Code Splitting:
```typescript
// src/App.tsx
import { lazy, Suspense } from 'react';

const PromptsView = lazy(() => import('./components/views/PromptsView'));
const ChatWindow = lazy(() => import('./components/chat/ChatWindow'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PromptsView />
      <ChatWindow />
    </Suspense>
  );
}
```

2. Caching:
```typescript
// src/hooks/prompts/usePromptsState.ts
const CACHE_KEY = 'prompts_cache';
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

function usePromptsCache() {
  const getCache = () => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return data;
      }
    }
    return null;
  };

  const setCache = (data: any) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  };

  return { getCache, setCache };
}
```

## 11. Security Considerations

1. Authentication:
   - Use Supabase Auth
   - Implement proper session management
   - Secure API endpoints

2. Data Access:
   - Use Row Level Security (RLS)
   - Validate user permissions
   - Sanitize user input

3. API Security:
   - Rate limiting
   - Input validation
   - Error handling

4. Environment Variables:
   - Secure storage
   - Different values per environment
   - Regular rotation

## 12. Monitoring

1. Error Tracking:
```typescript
// src/utils/monitoring.ts
export function trackError(error: Error, context?: Record<string, any>) {
  // Send to error tracking service
  console.error('Error:', error, context);
}

export function trackMetric(name: string, value: number) {
  // Send to metrics service
  console.log('Metric:', name, value);
}
```

2. Performance Monitoring:
```typescript
// src/utils/performance.ts
export function measureTiming(name: string, fn: () => Promise<any>) {
  const start = performance.now();
  return fn().finally(() => {
    const duration = performance.now() - start;
    trackMetric(`${name}_duration`, duration);
  });
}
```

## Next Steps

1. Set up repository and CI/CD
2. Configure Supabase project
3. Implement core components
4. Set up chat integration
5. Deploy to Netlify
6. Add monitoring and analytics
7. Implement testing strategy
8. Optimize performance
### A. Memory Management

```typescript
class MemoryManager {
  private static readonly MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100MB
  private static readonly CLEANUP_THRESHOLD = 0.9; // 90%

  private memoryUsage = new Map<string, number>();
  private totalUsage = 0;

  track(key: string, size: number) {
    this.memoryUsage.set(key, size);
    this.totalUsage += size;

    if (this.totalUsage > MemoryManager.MAX_CACHE_SIZE * MemoryManager.CLEANUP_THRESHOLD) {
      this.cleanup();
    }
  }

  private cleanup() {
    const entries = Array.from(this.memoryUsage.entries())
      .sort(([, a], [, b]) => b - a);

    let freedSpace = 0;
    const targetReduction = this.totalUsage - (MemoryManager.MAX_CACHE_SIZE * 0.7);

    for (const [key, size] of entries) {
      this.memoryUsage.delete(key);
      freedSpace += size;
      if (freedSpace >= targetReduction) break;
    }

    this.totalUsage -= freedSpace;
  }
}
```

### B. Worker Thread Pool

```typescript
import { Worker } from 'worker_threads';

class WorkerPool {
  private workers: Worker[] = [];
  private queue: Array<{
    task: any;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];
  private activeWorkers = 0;

  constructor(private size: number, private workerScript: string) {
    for (let i = 0; i < size; i++) {
      this.workers.push(new Worker(workerScript));
    }
  }

  async execute(task: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.queue.length === 0 || this.activeWorkers >= this.size) {
      return;
    }

    const worker = this.workers[this.activeWorkers++];
    const { task, resolve, reject } = this.queue.shift()!;

    try {
      const result = await worker.postMessage(task);
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.activeWorkers--;
      this.processQueue();
    }
  }
}
```

### C. Adaptive Rate Limiting

```typescript
class AdaptiveRateLimiter {
  private windowStats = new Map<string, {
    count: number;
    errors: number;
    latency: number[];
  }>();

  private readonly MAX_ERROR_RATE = 0.05; // 5%
  private readonly TARGET_LATENCY = 500; // 500ms

  async shouldAllow(key: string): Promise<boolean> {
    const stats = this.windowStats.get(key) || {
      count: 0,
      errors: 0,
      latency: []
    };

    // Calculate error rate
    const errorRate = stats.count > 0 ? stats.errors / stats.count : 0;
    if (errorRate > this.MAX_ERROR_RATE) {
      return false;
    }

    // Check average latency
    const avgLatency = stats.latency.length > 0
      ? stats.latency.reduce((a, b) => a + b) / stats.latency.length
      : 0;

    if (avgLatency > this.TARGET_LATENCY) {
      return false;
    }

    return true;
  }

  recordMetrics(key: string, latency: number, error: boolean) {
    const stats = this.windowStats.get(key) || {
      count: 0,
      errors: 0,
      latency: []
    };

    stats.count++;
    if (error) stats.errors++;
    stats.latency.push(latency);

    // Keep only last 100 latency samples
    if (stats.latency.length > 100) {
      stats.latency.shift();
    }

    this.windowStats.set(key, stats);
  }
}
```

### D. Circuit Breaker

```typescript
enum CircuitState {
  CLOSED,
  OPEN,
  HALF_OPEN
}

class CircuitBreaker {
  private state = CircuitState.CLOSED;
  private failures = 0;
  private lastFailure: number | null = null;
  private readonly FAILURE_THRESHOLD = 5;
  private readonly RESET_TIMEOUT = 30000; // 30 seconds

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (this.shouldReset()) {
        this.state = CircuitState.HALF_OPEN;
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = CircuitState.CLOSED;
  }

  private onFailure() {
    this.failures++;
    this.lastFailure = Date.now();

    if (this.failures >= this.FAILURE_THRESHOLD) {
      this.state = CircuitState.OPEN;
    }
  }

  private shouldReset(): boolean {
    return this.lastFailure !== null &&
           Date.now() - this.lastFailure > this.RESET_TIMEOUT;
  }
}
```

### E. Metrics Collection

```typescript
class MetricsCollector {
  private metrics = new Map<string, {
    count: number;
    errors: number;
    latency: number[];
    lastUpdate: number;
  }>();

  record(metric: {
    name: string;
    value: number;
    error?: boolean;
    tags?: Record<string, string>;
  }) {
    const key = this.getMetricKey(metric.name, metric.tags);
    const stats = this.metrics.get(key) || {
      count: 0,
      errors: 0,
      latency: [],
      lastUpdate: Date.now()
    };

    stats.count++;
    if (metric.error) stats.errors++;
    stats.latency.push(metric.value);
    stats.lastUpdate = Date.now();

    this.metrics.set(key, stats);
  }

  getMetrics(): Record<string, {
    count: number;
    errorRate: number;
    avgLatency: number;
    p95Latency: number;
  }> {
    const result: Record<string, any> = {};

    for (const [key, stats] of this.metrics.entries()) {
      const sortedLatency = [...stats.latency].sort((a, b) => a - b);
      const p95Index = Math.floor(sortedLatency.length * 0.95);

      result[key] = {
        count: stats.count,
        errorRate: stats.errors / stats.count,
        avgLatency: stats.latency.reduce((a, b) => a + b) / stats.latency.length,
        p95Latency: sortedLatency[p95Index] || 0
      };
    }

    return result;
  }

  private getMetricKey(name: string, tags?: Record<string, string>): string {
    if (!tags) return name;
    const sortedTags = Object.entries(tags)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join(',');
    return `${name}{${sortedTags}}`;
  }
}
```

This completes the integration guide with advanced optimization techniques for production deployment. These components provide robust memory management, worker thread pooling, adaptive rate limiting, circuit breaking, and comprehensive metrics collection.

The system is now ready for high-scale production use with proper monitoring, error handling, and performance optimization in place.