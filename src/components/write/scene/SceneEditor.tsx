import React from 'react';
import { Button } from '../../ui/button';
import { CharacterList } from './editor/CharacterList';
import { EmotionalArc } from './editor/EmotionalArc';
import { SceneBeats } from './editor/SceneBeats';
import { ScriptEditor } from './editor/ScriptEditor';
import type { Scene } from '../../../types/write';

interface SceneEditorProps {
  scene: Scene;
  onUpdate: (updates: Partial<Scene>) => void;
}

export const SceneEditor: React.FC<SceneEditorProps> = ({
  scene,
  onUpdate
}) => {
  return (
    <div className="flex-1 flex">
      <div className="w-1/2 border-r-4 border-black flex flex-col">
        <CharacterList
          characters={scene.characters}
          onUpdate={(characters) => onUpdate({ characters })}
        />
        <EmotionalArc
          start={scene.emotionalStart}
          end={scene.emotionalEnd}
          progress={scene.emotionalProgress}
          isPositive={scene.isPositiveArc}
          onUpdate={(updates) => onUpdate(updates)}
        />
        <SceneBeats
          beats={scene.beats}
          onUpdate={(beats) => onUpdate({ beats })}
        />
      </div>
      <ScriptEditor
        content={scene.content}
        onUpdate={(content) => onUpdate({ content })}
      />
    </div>
  );
};