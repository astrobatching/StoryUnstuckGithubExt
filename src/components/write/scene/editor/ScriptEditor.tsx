import React from 'react';

interface ScriptEditorProps {
  content: string;
  onUpdate: (content: string) => void;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  content,
  onUpdate
}) => {
  return (
    <div className="flex-1">
      <textarea
        className="w-full h-full p-4 font-mono text-sm border-2 border-black resize-none"
        value={content}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder="INT. LOCATION - TIME

Description of the scene...

CHARACTER
(action)
Dialogue..."
      />
    </div>
  );
};