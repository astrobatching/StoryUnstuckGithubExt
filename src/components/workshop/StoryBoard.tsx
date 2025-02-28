import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { StoryCard } from './StoryCard';

interface Story {
  id: string;
  title: string;
  content: string;
}

interface StoryBoardProps {
  stories: Story[];
  onAddStory: () => void;
  onDeleteStory: (id: string) => void;
  onUpdateStory: (id: string, title: string, content: string) => void;
}

export const StoryBoard: React.FC<StoryBoardProps> = ({
  stories,
  onAddStory,
  onDeleteStory,
  onUpdateStory,
}) => {
  return (
    <div className="h-full border-4 border-black bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Story Ideas</h2>
        <Button onClick={onAddStory}>
          <Plus className="h-4 w-4 mr-2" />
          Add Story
        </Button>
      </div>
      <div className="overflow-y-auto h-[calc(100%-4rem)]">
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            id={story.id}
            title={story.title}
            content={story.content}
            onDelete={onDeleteStory}
            onUpdate={onUpdateStory}
          />
        ))}
      </div>
    </div>
  );
};