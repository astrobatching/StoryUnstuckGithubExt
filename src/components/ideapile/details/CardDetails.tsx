import React from 'react';
import { Clock, Tag, Link as LinkIcon } from 'lucide-react';
import { Button } from '../../ui/button';

export const CardDetails: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Quick Info */}
      <div>
        <h3 className="font-medium mb-3">Quick Info</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>Created 2 days ago</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-400" />
            <span>3 tags</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="font-medium mb-3">Tags</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
          >
            <Tag className="h-3 w-3 mr-1" />
            research
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
          >
            <Tag className="h-3 w-3 mr-1" />
            inspiration
          </Button>
        </div>
      </div>

      {/* Related Links */}
      <div>
        <h3 className="font-medium mb-3">Related Links</h3>
        <div className="space-y-2">
          <a 
            href="#"
            className="block p-2 bg-gray-50 rounded border-2 border-black text-sm hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              <span className="flex-1">Research Document</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};