import type { LucideIcon } from 'lucide-react';

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