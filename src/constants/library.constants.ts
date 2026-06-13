import { File, FileAudio, FileText, type LucideIcon } from 'lucide-react';
import type { LibraryItem } from '../api/library';

export const LIBRARY_ITEM_TYPE_META: Record<
  LibraryItem['itemType'],
  { label: string; icon: LucideIcon; color: string }
> = {
  AUDIO: {
    label: 'صوتي',
    icon: FileAudio,
    color: 'text-purple-600 bg-purple-50',
  },
  WORD_DOC: {
    label: 'Word',
    icon: FileText,
    color: 'text-blue-600 bg-blue-50',
  },
  PDF: {
    label: 'PDF',
    icon: File,
    color: 'text-red-600 bg-red-50',
  },
  BRAILLE: {
    label: 'برايل',
    icon: FileText,
    color: 'text-yellow-600 bg-yellow-50',
  },
  OTHER: {
    label: 'أخرى',
    icon: File,
    color: 'text-gray-600 bg-gray-50',
  },
};

export const LIBRARY_ITEM_TYPES = Object.entries(LIBRARY_ITEM_TYPE_META).map(
  ([value, metadata]) => ({
    value: value as LibraryItem['itemType'],
    label: metadata.label,
  }),
);
