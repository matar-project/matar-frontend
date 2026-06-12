import { z } from 'zod';

export const requestHelpSchema = z
  .object({
    requestType: z.enum([
      'PDF_TO_WORD',
      'PDF_TO_AUDIO',
      'ACCOMPANIMENT',
    ]),
    bookName: z.string().optional(),
    details: z.string().min(10, 'يرجى كتابة 10 أحرف على الأقل'),
    pdfFile: z.custom<FileList>().optional(),
    totalPages: z.string().optional(),
  })
  .superRefine((value, context) => {
    if (value.requestType === 'ACCOMPANIMENT') return;
    if (!value.bookName?.trim()) {
      context.addIssue({
        code: 'custom',
        path: ['bookName'],
        message: 'اسم الكتاب مطلوب',
      });
    }
    const totalPages = Number(value.totalPages);
    if (!Number.isInteger(totalPages) || totalPages < 1) {
      context.addIssue({
        code: 'custom',
        path: ['totalPages'],
        message: 'عدد الصفحات مطلوب ويجب أن يكون رقما موجبا',
      });
    }
    const file = value.pdfFile?.[0];
    if (!file) {
      context.addIssue({
        code: 'custom',
        path: ['pdfFile'],
        message: 'ملف PDF مطلوب',
      });
      return;
    }
    if (
      file.type !== 'application/pdf' ||
      !file.name.toLowerCase().endsWith('.pdf')
    ) {
      context.addIssue({
        code: 'custom',
        path: ['pdfFile'],
        message: 'يسمح بملفات PDF فقط',
      });
    }
    if (file.size > 25 * 1024 * 1024) {
      context.addIssue({
        code: 'custom',
        path: ['pdfFile'],
        message: 'حجم الملف يجب ألا يتجاوز 25 ميجابايت',
      });
    }
  });

export type RequestHelpFormValues = z.infer<typeof requestHelpSchema>;
