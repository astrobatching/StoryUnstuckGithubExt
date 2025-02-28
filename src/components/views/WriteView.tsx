import React from 'react';
import { WriteLayout } from '../write/layout/WriteLayout';
import { SceneContent } from '../write/scene/SceneContent';
import { useWriteNavigation } from '../../hooks/write/useWriteNavigation';

export const WriteView: React.FC = () => {
  const {
    activeSceneId,
    isNavCollapsed,
    toggleNavigation,
    selectScene
  } = useWriteNavigation();

  return (
    <WriteLayout
      isNavCollapsed={isNavCollapsed}
      onToggleNav={toggleNavigation}
      activeSceneId={activeSceneId}
      onSceneSelect={selectScene}
    >
      {activeSceneId ? (
        <SceneContent
          sceneId={activeSceneId}
          onClose={() => selectScene(undefined)}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 font-mono">
          Select a scene to begin editing
        </div>
      )}
    </WriteLayout>
  );
};