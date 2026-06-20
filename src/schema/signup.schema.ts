import { z } from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';
import type { SignupFormValues } from '../Types/auth.types';

// At least 3 of the 4 character classes: lowercase, uppercase, digit, symbol.
const PASSWORD_CHARACTER_CLASSES = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/];

const emailSchema = z
  .string()
  .trim()
  .min(1, 'البريد الإلكتروني مطلوب')
  .email('أدخل بريداً إلكترونياً صحيحاً')
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'أدخل نطاق بريد صحيحاً')
  .transform((value) => value.toLowerCase());

export const signupSchema: z.ZodType<SignupFormValues> = z
  .object({
    name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(100),
    email: emailSchema,
    phone: z
      .string()
      .min(1, 'رقم الهاتف مطلوب')
      .refine((value) => value.replace(/\D/g, '').length <= 15, 'رقم الهاتف طويل جداً')
      .refine(isValidPhoneNumber, 'أدخل رقم هاتف دولي صحيح'),
    country: z.string().length(2, 'الدولة مطلوبة'),
    city: z.string().min(2, 'المدينة مطلوبة').max(30),
    password: z
      .string()
      .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      .max(72, 'كلمة المرور طويلة جداً')
      .refine(
        (value) => PASSWORD_CHARACTER_CLASSES.filter((pattern) => pattern.test(value)).length >= 3,
        'يجب أن تحتوي كلمة المرور على 3 على الأقل من: حرف كبير، حرف صغير، رقم، رمز',
      ),
    confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
    role: z.enum(['volunteer', 'visually_impired']),
    healthReport: z.instanceof(File).nullable(),
  })
  .superRefine((data, context) => {
    if (data.password !== data.confirmPassword) {
      context.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'كلمتا المرور غير متطابقتين',
      });
    }
    if (data.role !== 'visually_impired') return;
    if (!data.healthReport) {
      context.addIssue({ code: 'custom', path: ['healthReport'], message: 'التقرير الصحي مطلوب' });
      return;
    }
    if (data.healthReport.size > 5 * 1024 * 1024) {
      context.addIssue({ code: 'custom', path: ['healthReport'], message: 'حجم الملف يجب ألا يتجاوز 5MB' });
    }
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(data.healthReport.type)) {
      context.addIssue({ code: 'custom', path: ['healthReport'], message: 'يُسمح فقط بملفات PDF وJPG وJPEG وPNG' });
    }
  });
