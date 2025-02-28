import React from 'react';
import type { SpineContentProps } from '../types';

export function NotePreview({ content }: SpineContentProps) {
  return (
    <p className="text-sm whitespace-pre-wrap font-mono">{content}</p>
  );
}