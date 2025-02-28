export const defaultPlotSections = [
  { 
    id: 'setup', 
    title: 'Setup', 
    color: 'bg-blue-500', 
    guide: 'Establish the world and characters' 
  },
  { 
    id: 'conflict', 
    title: 'Conflict', 
    color: 'bg-red-500', 
    guide: 'Introduce the main conflict' 
  },
  { 
    id: 'rising', 
    title: 'Rising Action', 
    color: 'bg-yellow-500', 
    guide: 'Escalate the stakes' 
  },
  { 
    id: 'climax', 
    title: 'Climax', 
    color: 'bg-purple-500', 
    guide: 'The highest point of tension' 
  },
  { 
    id: 'falling', 
    title: 'Falling Action', 
    color: 'bg-green-500', 
    guide: 'Show the aftermath' 
  },
  { 
    id: 'resolution', 
    title: 'Resolution', 
    color: 'bg-gray-500', 
    guide: 'Wrap up loose ends' 
  }
] as const;