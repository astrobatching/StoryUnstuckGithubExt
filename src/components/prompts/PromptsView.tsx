import React from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { StoryOverview } from './overview/StoryOverview';
import { PromptSection } from './PromptSection';
import { usePromptsState } from '../../hooks/prompts/usePromptsState';

export const PromptsView: React.FC = () => {
  const { 
    promptGroups, 
    addPromptGroup, 
    updatePromptGroup, 
    deletePromptGroup,
    addPrompt,
    updatePrompt
  } = usePromptsState();
  const [activeView, setActiveView] = React.useState<'prompts' | 'overview'>('overview');

  return (
    <div className="h-screen flex">
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            <h2 className="text-xl font-bold">Story Development</h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeView === 'overview' ? 'default' : 'ghost'}
              onClick={() => setActiveView('overview')}
            >
              Overview
            </Button>
            <Button
              variant={activeView === 'prompts' ? 'default' : 'ghost'}
              onClick={() => setActiveView('prompts')}
            >
              Prompts
            </Button>
          </div>
        </div>

        {activeView === 'overview' ? (
          <StoryOverview />
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Button onClick={addPromptGroup}>
                <Plus className="h-4 w-4 mr-2" />
                Add Prompt Group
              </Button>
            </div>

            {promptGroups.map(group => (
              <PromptSection
                key={group.id}
                id={group.id}
                title={group.title}
                prompts={group.prompts}
                onAddPrompt={addPrompt}
                onUpdatePrompt={(promptId, updates) => 
                  updatePrompt(group.id, promptId, updates)
                }
                onDeletePrompt={(promptId) =>
                  updatePromptGroup(group.id, { 
                    prompts: group.prompts.filter(p => p.id !== promptId) 
                  })
                }
                onUpdateTitle={(title) => 
                  updatePromptGroup(group.id, { title })
                }
                onDelete={() => deletePromptGroup(group.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};