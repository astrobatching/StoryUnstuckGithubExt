# Implementation Guide

## Core Components

### 1. Workshop View
```typescript
interface QuadrantColumnProps {
  id: string;
  title: string;
  stories: Story[];
  plotSections: Section[];
  plotPoints: PlotPoint[];
  isOpen: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onExpand: () => void;
  onCollapse: () => void;
}
```

Features:
- Quadrant-based organization
- Expandable/collapsible sections
- Draggable story cards
- Color-coded plot sections
- Editable headers with real-time updates

### 2. Timeline View
```typescript
interface TimelineGridProps {
  storylines: Storyline[];
  episodes: string[];
  onDeleteStoryline: (id: string) => void;
  onEditStoryline: (id: string, newName: string) => void;
  onToggleEpisode: (storylineId: string, episodeId: string) => void;
}
```

Features:
- Grid-based storyline tracking
- Color-coded story arcs
- Episode management
- Drag-and-drop storyline organization

## Drag-and-Drop Implementation

### 1. Story Cards
```typescript
const handleDragStart = (e: React.DragEvent, card: StoryCard) => {
  e.dataTransfer.setData('application/json', JSON.stringify({
    type: 'story-card',
    id: card.id,
    content: card.content,
    quadrantId: card.quadrantId
  }));
};

const handleDrop = (e: React.DragEvent, targetQuadrant: string) => {
  const data = JSON.parse(e.dataTransfer.getData('application/json'));
  if (data.type === 'story-card') {
    moveCard(data.id, targetQuadrant);
  }
};
```

### 2. Plot Points
```typescript
const handlePlotPointDrag = (e: React.DragEvent, point: PlotPoint) => {
  e.dataTransfer.setData('application/json', JSON.stringify({
    type: 'plot-point',
    id: point.id,
    sectionId: point.sectionId
  }));
};
```

### 3. Timeline Elements
```typescript
const handleStorylineDrag = (e: React.DragEvent, storyline: Storyline) => {
  e.dataTransfer.setData('application/json', JSON.stringify({
    type: 'storyline',
    id: storyline.id,
    color: storyline.color
  }));
};
```

## State Management

### 1. Context Structure
```typescript
interface ChatContextType {
  messages: Message[];
  addMessage: (content: string, type: MessageType) => void;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  selectedModel: string;
  setSelectedModel: (value: string) => void;
}

interface WorkshopContextType {
  quadrants: Quadrant[];
  stories: Story[];
  plotPoints: PlotPoint[];
  updateStory: (id: string, updates: Partial<Story>) => void;
  moveStory: (id: string, targetQuadrant: string) => void;
}
```

### 2. State Updates
```typescript
const updateStory = (id: string, updates: Partial<Story>) => {
  setStories(prev => prev.map(story =>
    story.id === id ? { ...story, ...updates } : story
  ));
};

const moveStoryToQuadrant = (storyId: string, targetQuadrantId: string) => {
  setStories(prev => prev.map(story =>
    story.id === storyId
      ? { ...story, quadrantId: targetQuadrantId }
      : story
  ));
};
```

## Styling System

### 1. Tailwind Configuration
```typescript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#FFFFFF'
      },
      borderWidth: {
        '3': '3px',
        '6': '6px'
      }
    }
  }
};
```

### 2. Utility Functions
```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Integration Examples

### 1. ChatGPT Integration
```typescript
async function generateStoryIdeas(prompt: string) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  return response.json();
}
```

### 2. Anthropic Integration
```typescript
async function analyzeStoryStructure(content: string) {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  return response.json();
}
```

### 3. Coda/Notion Integration
```typescript
async function syncWithExternalTools(data: ProjectData) {
  // Coda sync
  await fetch('/api/sync/coda', {
    method: 'POST',
    body: JSON.stringify(data)
  });

  // Notion sync
  await fetch('/api/sync/notion', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
```

## Migration Guide

### 1. Data Migration
```typescript
interface MigrationStep {
  version: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

const migrations: MigrationStep[] = [
  {
    version: '2.0.0',
    up: async () => {
      // Update story card structure
      await updateStoryCards();
      // Migrate timeline data
      await migrateTimeline();
    },
    down: async () => {
      // Rollback changes
      await rollbackChanges();
    }
  }
];
```

### 2. Feature Updates
- Editable headers: Update component props and state management
- Color customization: Add color picker and state persistence
- New drag-and-drop features: Update event handlers and data structure

## Known Issues and Roadmap

### Current Limitations
1. Performance with large numbers of story cards
2. Complex drag-and-drop interactions between views
3. Real-time collaboration conflicts

### Planned Improvements
1. Virtual scrolling for large datasets
2. Enhanced drag-and-drop preview
3. Offline support
4. Real-time collaboration
5. Advanced AI integration

## Accessibility

### 1. ARIA Implementation
```typescript
// Example of accessible drag and drop
<div
  role="button"
  aria-grabbed={isDragging}
  aria-dropeffect="move"
  tabIndex={0}
  onKeyDown={handleKeyDown}
>
  {/* Card content */}
</div>
```

### 2. Keyboard Navigation
```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  switch (e.key) {
    case 'Enter':
    case ' ':
      handleCardActivation();
      break;
    case 'ArrowUp':
    case 'ArrowDown':
      handleVerticalNavigation(e.key);
      break;
  }
};
```

### 3. Focus Management
```typescript
const FocusTrapper: React.FC = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      // Implement focus trap
    }
  }, []);

  return <div ref={ref}>{children}</div>;
};
```