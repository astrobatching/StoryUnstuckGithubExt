import React, { useState } from 'react';
import { EditableText } from './EditableText';

interface HeaderData {
  title: string;
  subtitle: string;
}

export const EditableTextExample: React.FC = () => {
  const [headerData, setHeaderData] = useState<HeaderData>({
    title: 'ACT 1',
    subtitle: 'Opening Sequence'
  });

  const handleTitleChange = (newTitle: string) => {
    setHeaderData(prev => ({ ...prev, title: newTitle }));
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    setHeaderData(prev => ({ ...prev, subtitle: newSubtitle }));
  };

  return (
    <div className="bg-blue-500 p-4 border-b-4 border-black">
      <div className="flex flex-col min-w-0">
        <EditableText
          value={headerData.title}
          onChange={handleTitleChange}
          isTitle
          placeholder="Enter title..."
        />
        <EditableText
          value={headerData.subtitle}
          onChange={handleSubtitleChange}
          placeholder="Add subtitle..."
        />
      </div>
    </div>
  );
};