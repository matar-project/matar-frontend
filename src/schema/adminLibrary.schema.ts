import { z } from 'zod';

export const adminLibrarySchema = z.object({
  title: z.string().min(1, 'العنوان مطلوب'),
  author: z.string().optional(),
  subject: z.string().optional(),
  curriculum: z.string().optional(),
  country: z.string().optional(),
  description: z.string().optional(),
  itemType: z.enum(['AUDIO', 'WORD_DOC', 'PDF', 'BRAILLE', 'OTHER'], {
    error: 'نوع الملف مطلوب',
  }),
  fileUrl: z
    .string()
    .min(1, 'رابط الملف مطلوب')
    .url('رابط غير صالح'),
  fileName: z.string().min(1, 'اسم الملف مطلوب'),
});

export type AdminLibraryFormValues = z.infer<typeof adminLibrarySchema>;
