import React from 'react';
import { X } from 'lucide-react';
import { SceneHeader } from './SceneHeader';
import { SceneEditor } from './SceneEditor';
import { SceneNotes } from './SceneNotes';
import { useSceneState } from '../../../hooks/write/useSceneState';
import { useWriteNavigation } from '../../../hooks/write/useWriteNavigation';

interface SceneContentProps {
  sceneId: string;
  onClose: () => void;
}

export const SceneContent: React.FC<SceneContentProps> = ({
  sceneId,
  onClose
}) => {
  const { getSceneTitle } = useWriteNavigation();
  const {
    scene,
    tags,
    notes,
    addTag,
    addNote,
    updateScene,
    initializeScene
  } = useSceneState(sceneId);

  // Initialize scene if it doesn't exist
  React.useEffect(() => {
    if (!scene) {
      initializeScene({
        id: sceneId,
        title: getSceneTitle(sceneId)
      });
    }
  }, [scene, sceneId, initializeScene, getSceneTitle]);

  if (!scene) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 font-mono">
        Loading scene...
      </div>
    );
  }

  return (
    <div className="flex-1 flex">
      <div className="flex-1 flex flex-col">
        <SceneHeader
          sceneId={sceneId}
          title={scene.title}
          tags={tags}
          onAddTag={addTag}
          onClose={onClose}
        />
        <SceneEditor
          scene={scene}
          onUpdate={updateScene}
        />
      </div>
      <SceneNotes
        notes={notes}
        onAddNote={addNote}
      />
    </div>
  );
};