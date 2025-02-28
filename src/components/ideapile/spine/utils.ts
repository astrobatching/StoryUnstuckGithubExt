import { NotePreview } from './previews/NotePreview';
import { ImagePreview } from './previews/ImagePreview';
import { LinkPreview } from './previews/LinkPreview';
import { VoicePreview } from './previews/VoicePreview';
import type { ContentType } from '../../../types/ideapile';
import type { SpineContentProps } from './types';

type PreviewComponent = React.FC<SpineContentProps>;

export function getPreviewComponent(type: ContentType): PreviewComponent {
  switch (type) {
    case 'image':
      return ImagePreview;
    case 'link':
    case 'reference':
      return LinkPreview;
    case 'voice':
      return VoicePreview;
    default:
      return NotePreview;
  }
}