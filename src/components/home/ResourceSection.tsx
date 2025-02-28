import React from 'react';
import { File, Tag } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface Resource {
  id: string;
  name: string;
  type: string;
  url: string;
  tags: string[];
  uploadDate: Date;
}

interface ResourceSectionProps {
  resources: Resource[];
}

export const ResourceSection: React.FC<ResourceSectionProps> = ({ resources }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {resources.map(resource => (
        <Card key={resource.id} className="border-4 border-black">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <File className="h-8 w-8 text-gray-400" />
              <div className="flex-1">
                <h4 className="font-bold mb-1">{resource.name}</h4>
                <div className="flex flex-wrap gap-1 mb-2">
                  {resource.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  Added {resource.uploadDate.toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};