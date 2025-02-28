// Core prompt types
export interface PromptFile {
  id: string;
  name: string;
  type: 'pdf' | 'text';
  content: string;
  url?: string;
  createdAt: Date;
}

export interface Prompt {
  id: string;
  title: string;
  details: string;
  action: string;
  files: PromptFile[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PromptGroup {
  id: string;
  title: string;
  description?: string;
  color?: string;
  prompts: Prompt[];
}

// State management types
export interface PromptsState {
  groups: PromptGroup[];
  activePrompt?: string;
  selectedFile?: string;
}

// Action types
export type PromptAction = 
  | { type: 'ADD_GROUP'; payload: Omit<PromptGroup, 'id' | 'prompts'> }
  | { type: 'UPDATE_GROUP'; payload: { id: string; updates: Partial<PromptGroup> } }
  | { type: 'DELETE_GROUP'; payload: string }
  | { type: 'ADD_PROMPT'; payload: { groupId: string; prompt: Omit<Prompt, 'id' | 'files' | 'createdAt' | 'updatedAt'> } }
  | { type: 'UPDATE_PROMPT'; payload: { groupId: string; promptId: string; updates: Partial<Prompt> } }
  | { type: 'DELETE_PROMPT'; payload: { groupId: string; promptId: string } }
  | { type: 'ADD_FILE'; payload: { groupId: string; promptId: string; file: Omit<PromptFile, 'id' | 'createdAt'> } }
  | { type: 'DELETE_FILE'; payload: { groupId: string; promptId: string; fileId: string } }
  | { type: 'SET_ACTIVE_PROMPT'; payload: string | undefined }
  | { type: 'SET_SELECTED_FILE'; payload: string | undefined };