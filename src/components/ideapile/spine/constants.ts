import { MessageSquare, Camera, Link2, Mic } from 'lucide-react';
import type { ContentType } from '../../../types/ideapile';
import type { SpineTypeConfig } from './types';

export const SPINE_CONFIGS: Record<ContentType, SpineTypeConfig> = {
  note: {
    icon: MessageSquare,
    colors: {
      border: 'border-l-blue-500',
      background: 'bg-blue-50',
      hover: 'hover:bg-blue-50'
    }
  },
  image: {
    icon: Camera,
    colors: {
      border: 'border-l-green-500',
      background: 'bg-green-50',
      hover: 'hover:bg-green-50'
    }
  },
  voice: {
    icon: Mic,
    colors: {
      border: 'border-l-purple-500', 
      background: 'bg-purple-50',
      hover: 'hover:bg-purple-50'
    }
  },
  link: {
    icon: Link2,
    colors: {
      border: 'border-l-orange-500',
      background: 'bg-orange-50',
      hover: 'hover:bg-orange-50'
    }
  },
  reference: {
    icon: Link2,
    colors: {
      border: 'border-l-gray-500',
      background: 'bg-gray-50',
      hover: 'hover:bg-gray-50'
    }
  }
};