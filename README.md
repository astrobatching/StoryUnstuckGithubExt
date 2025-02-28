# StoryUnstuck

A powerful story development application that combines visual organization, AI assistance, and structured writing tools to help writers plan, organize, and write their stories effectively.

## Core Features

### 1. Workshop View
- Quadrant-based story development
- Drag-and-drop story cards
- Color-coded plot sections
- Expandable/collapsible sections
- AI-assisted brainstorming

### 2. Episodes View
- Visual episode planning
- Act structure templates
- Scene management
- Drag-and-drop scene organization
- Direct text editing

### 3. Timeline View
- Visual storyline tracking
- Color-coded story arcs
- Episode-by-episode planning
- Collapsible timeline interface
- Storyline management

### 4. Prompts View
- Story overview blocks
- Customizable prompt sections
- Drag-and-drop block organization
- Expandable/collapsible blocks
- Rich text editing

### 5. Tasks View
- Kanban board organization
- Drag-and-drop task management
- Comments and discussions
- Progress tracking
- Task categorization

### 6. Idea Pile
- Column-based organization
- Multiple content types (notes, images, links)
- Tag management
- Quick filters
- Source tracking

### 7. AI Integration
- Context-aware assistance
- Real-time suggestions
- Story element analysis
- Character development help
- Plot structure guidance

## Project Structure

```
src/
├── components/          # UI components
│   ├── chat/           # AI chat interface
│   ├── episodes/       # Episode management
│   ├── ideapile/       # Idea organization
│   ├── layout/         # Common layouts
│   ├── prompts/        # Writing prompts
│   ├── tasks/          # Task management
│   ├── timeline/       # Story timeline
│   ├── ui/             # Shared UI components
│   ├── views/          # Main view components
│   └── workshop/       # Story workshop
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/               # Utility functions
├── types/             # TypeScript types
└── utils/             # Helper utilities
```

## Development Workflow

1. **Navigation**
   - Home view for project management
   - Seamless navigation between views
   - Persistent state across views

2. **Data Management**
   - Local storage persistence
   - Real-time synchronization
   - Optimistic updates
   - Data export/import

3. **UI/UX**
   - Consistent design system
   - Responsive layouts
   - Drag-and-drop interactions
   - Keyboard shortcuts

4. **State Management**
   - React Context for global state
   - Custom hooks for feature logic
   - TypeScript for type safety
   - Modular state organization

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Best Practices

1. **Code Organization**
   - Small, focused components
   - Custom hooks for logic
   - TypeScript for type safety
   - Consistent file structure

2. **State Management**
   - Context for global state
   - Local state when possible
   - Optimistic updates
   - Error handling

3. **UI Components**
   - Reusable components
   - Consistent styling
   - Accessibility
   - Responsive design

4. **Performance**
   - Code splitting
   - Lazy loading
   - Memoization
   - Virtual scrolling

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.