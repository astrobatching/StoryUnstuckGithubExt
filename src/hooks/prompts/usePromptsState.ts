import { useState, useCallback } from 'react';
import { logger } from '../../utils/logger';
import type { Prompt, PromptGroup, PromptFile } from '../../types/prompts';

const STORAGE_KEY = 'prompts_data';

export function usePromptsState() {
  const [promptGroups, setPromptGroups] = useState<PromptGroup[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveToStorage = useCallback((groups: PromptGroup[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
    } catch (error) {
      logger.error('Failed to save prompts:', error);
    }
  }, []);

  const addPromptGroup = useCallback(() => {
    const newGroup: PromptGroup = {
      id: Date.now().toString(),
      title: 'New Prompt Group',
      color: 'bg-[#00FFF0]', // Default color
      prompts: []
    };

    setPromptGroups(prev => {
      const next = [...prev, newGroup];
      saveToStorage(next);
      return next;
    });
    logger.debug('Added new prompt group:', newGroup);
  }, [saveToStorage]);

  const updatePromptGroup = useCallback((groupId: string, updates: Partial<PromptGroup>) => {
    logger.debug('Updating prompt group:', { groupId, updates });
    setPromptGroups(prev => {
      const next = prev.map(group =>
        group.id === groupId ? { ...group, ...updates } : group
      );
      saveToStorage(next);
      return next;
    });
  }, [saveToStorage]);

  const deletePromptGroup = useCallback((groupId: string) => {
    setPromptGroups(prev => {
      const next = prev.filter(group => group.id !== groupId);
      saveToStorage(next);
      return next;
    });
    logger.debug('Deleted prompt group:', groupId);
  }, [saveToStorage]);

  const addPrompt = useCallback((groupId: string) => {
    const newPrompt: Prompt = {
      id: Date.now().toString(),
      title: 'New Prompt',
      details: '',
      action: '',
      files: [],
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setPromptGroups(prev => {
      const next = prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            prompts: [...group.prompts, newPrompt]
          };
        }
        return group;
      });
      saveToStorage(next);
      return next;
    });
    logger.debug('Added new prompt:', { groupId, prompt: newPrompt });
  }, [saveToStorage]);

  const updatePrompt = useCallback((groupId: string, promptId: string, updates: Partial<Prompt>) => {
    setPromptGroups(prev => {
      const next = prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            prompts: group.prompts.map(prompt =>
              prompt.id === promptId
                ? { ...prompt, ...updates, updatedAt: new Date() }
                : prompt
            )
          };
        }
        return group;
      });
      saveToStorage(next);
      return next;
    });
    logger.debug('Updated prompt:', { groupId, promptId, updates });
  }, [saveToStorage]);

  const addFile = useCallback((groupId: string, promptId: string, file: Omit<PromptFile, 'id' | 'createdAt'>) => {
    const newFile: PromptFile = {
      ...file,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    setPromptGroups(prev => {
      const next = prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            prompts: group.prompts.map(prompt =>
              prompt.id === promptId
                ? { 
                    ...prompt, 
                    files: [...prompt.files, newFile],
                    updatedAt: new Date()
                  }
                : prompt
            )
          };
        }
        return group;
      });
      saveToStorage(next);
      return next;
    });
    logger.debug('Added file to prompt:', { groupId, promptId, file: newFile });
  }, [saveToStorage]);

  const deleteFile = useCallback((groupId: string, promptId: string, fileId: string) => {
    setPromptGroups(prev => {
      const next = prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            prompts: group.prompts.map(prompt =>
              prompt.id === promptId
                ? {
                    ...prompt,
                    files: prompt.files.filter(f => f.id !== fileId),
                    updatedAt: new Date()
                  }
                : prompt
            )
          };
        }
        return group;
      });
      saveToStorage(next);
      return next;
    });
    logger.debug('Deleted file from prompt:', { groupId, promptId, fileId });
  }, [saveToStorage]);

  return {
    promptGroups,
    addPromptGroup,
    updatePromptGroup,
    deletePromptGroup,
    addPrompt,
    updatePrompt,
    addFile,
    deleteFile
  };
}