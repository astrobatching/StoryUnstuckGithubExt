import type { LucideIcon } from 'lucide-react';
import type { ContentType } from '../../../types/ideapile';

export interface SpineMetadata {
  duration?: string;
  imageUrl?: string;
  linkUrl?: string;
  transcription?: string;
}

export interface SpineColors {
  border: string;
  background: string;
  hover: string;
}

export interface SpineTypeConfig {
  icon: LucideIcon;
  colors: SpineColors;
}

export interface SpineContentProps {
  content: string;
  metadata?: SpineMetadata;
  onEdit?: () => void;
}

export interface SpinePreviewProps {
  type: ContentType;
  content: string;
  metadata?: SpineMetadata;
  tags: string[];
  onEdit: () => void;
  onDelete: () => void;
}