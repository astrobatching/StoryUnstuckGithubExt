import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../ui/button';
import { StoryBlock } from './StoryBlock';
import { cn } from '../../../lib/utils';

interface Block {
  id: string;
  title: string;
  color: string;
  sections: Array<{
    id: string;
    title: string;
    content: string;
  }>;
}

const defaultBlocks: Block[] = [
  {
    id: '1',
    title: 'GENRE & THEME',
    color: 'bg-blue-500',
    sections: [
      { id: '1-1', title: 'External & Internal Genre', content: '' },
      { id: '1-2', title: 'Theme/Controlling Idea', content: '' },
      { id: '1-3', title: 'NOT Goal', content: '' },
      { id: '1-4', title: 'Four Throughlines', content: '' }
    ]
  },
  {
    id: '2',
    title: 'CHARACTER & CONFLICT',
    color: 'bg-red-500',
    sections: [
      { id: '2-1', title: 'Want vs Need', content: '' },
      { id: '2-2', title: 'Terrible Trajectory', content: '' },
      { id: '2-3', title: 'Stakes', content: '' },
      { id: '2-4', title: 'Third Choice Resolution', content: '' }
    ]
  },
  {
    id: '3',
    title: 'STORY STRUCTURE',
    color: 'bg-green-500',
    sections: [
      { id: '3-1', title: 'Nutshell Elements', content: '' },
      { id: '3-2', title: 'Obligatory Scenes', content: '' },
      { id: '3-3', title: 'Decision Points', content: '' },
      { id: '3-4', title: 'Cost of Failure', content: '' }
    ]
  },
  {
    id: '4',
    title: 'PLOT FRAMEWORK',
    color: 'bg-purple-500',
    sections: [
      { id: '4-1', title: 'Situation Framework (A/B Story)', content: '' },
      { id: '4-2', title: 'Story Strands', content: '' },
      { id: '4-3', title: 'Conflict Layers', content: '' },
      { id: '4-4', title: 'Opening Hook', content: '' }
    ]
  }
];

const blockColors = ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-[#00FFF0]'];

export const StoryOverview: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>(defaultBlocks);
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set(['1']));

  const toggleExpand = (blockId: string) => {
    setExpandedBlocks(prev => {
      const next = new Set(prev);
      if (next.has(blockId)) {
        next.delete(blockId);
      } else {
        next.add(blockId);
      }
      return next;
    });
  };

  const handleAddBlock = () => {
    const newBlock: Block = {
      id: Date.now().toString(),
      title: 'NEW BLOCK',
      color: blockColors[blocks.length % blockColors.length],
      sections: [
        { 
          id: `${blocks.length + 1}-1`,
          title: 'Section 1',
          content: ''
        }
      ]
    };
    setBlocks(prev => [...prev, newBlock]);
    setExpandedBlocks(prev => new Set(prev).add(newBlock.id));
  };

  const handleUpdateBlock = (blockId: string, updates: { title?: string; color?: string }) => {
    setBlocks(prev => prev.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    ));
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    setExpandedBlocks(prev => {
      const next = new Set(prev);
      next.delete(blockId);
      return next;
    });
  };

  const handleAddSection = (blockId: string) => {
    setBlocks(prev => prev.map(block => {
      if (block.id === blockId) {
        const newSection = {
          id: `${blockId}-${block.sections.length + 1}`,
          title: 'New Section',
          content: ''
        };
        return {
          ...block,
          sections: [...block.sections, newSection]
        };
      }
      return block;
    }));
  };

  const handleUpdateSection = (blockId: string, sectionId: string, updates: { title?: string; content?: string }) => {
    setBlocks(prev => prev.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          sections: block.sections.map(section =>
            section.id === sectionId ? { ...section, ...updates } : section
          )
        };
      }
      return block;
    }));
  };

  const handleDeleteSection = (blockId: string, sectionId: string) => {
    setBlocks(prev => prev.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          sections: block.sections.filter(section => section.id !== sectionId)
        };
      }
      return block;
    }));
  };

  return (
    <div className="p-6" style={{ transform: 'scale(0.7)', transformOrigin: 'top left', width: '143%', height: '143%' }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Story Overview</h2>
        <Button onClick={handleAddBlock}>
          <Plus className="h-4 w-4 mr-2" />
          Add Block
        </Button>
      </div>

      <div className={cn(
        'grid gap-6',
        'grid-cols-1 md:grid-cols-2'
      )}>
        {blocks.map(block => (
          <StoryBlock
            key={block.id}
            block={block}
            isExpanded={expandedBlocks.has(block.id)}
            onToggleExpand={() => toggleExpand(block.id)}
            onUpdateBlock={(updates) => handleUpdateBlock(block.id, updates)}
            onDelete={() => handleDeleteBlock(block.id)}
            onAddSection={() => handleAddSection(block.id)}
            onUpdateSection={(sectionId, updates) => 
              handleUpdateSection(block.id, sectionId, updates)
            }
            onDeleteSection={(sectionId) => handleDeleteSection(block.id, sectionId)}
          />
        ))}
      </div>
    </div>
  );
};