import React from 'react';
import { UserPlus, X } from 'lucide-react';
import { Button } from '../../../ui/button';
import { cn } from '../../../../lib/utils';
import type { Character } from '../../../../types/write';

interface CharacterListProps {
  characters: Character[];
  onUpdate: (characters: Character[]) => void;
}

export const CharacterList: React.FC<CharacterListProps> = ({
  characters = [], // Add default empty array
  onUpdate
}) => {
  const toggleCharacter = (id: string) => {
    onUpdate(
      characters.map(char =>
        char.id === id ? { ...char, isActive: !char.isActive } : char
      )
    );
  };

  const addCharacter = () => {
    const name = prompt('Enter character name:');
    if (name) {
      onUpdate([
        ...characters,
        { id: Date.now().toString(), name, isActive: true }
      ]);
    }
  };

  const removeCharacter = (id: string) => {
    onUpdate(characters.filter(char => char.id !== id));
  };

  return (
    <div className="border-b-4 border-black p-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {characters.map(char => (
          <div key={char.id} className="flex items-center gap-1">
            <button
              onClick={() => toggleCharacter(char.id)}
              className={cn(
                'px-3 py-1 font-mono text-sm border-2 border-black',
                char.isActive ? 'bg-[#00FFF0]/20' : 'bg-gray-100'
              )}
            >
              {char.name}
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeCharacter(char.id)}
              className="h-6 w-6 p-1"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={addCharacter}
          className="border-2 border-black"
        >
          <UserPlus className="h-4 w-4" />
        </Button>
      </div>
      <input
        type="text"
        className="w-full p-2 border-2 border-black font-mono text-sm"
        placeholder="Scene objective..."
      />
    </div>
  );
};