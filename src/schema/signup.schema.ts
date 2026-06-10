import { z } from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';
import type { SignupRequest } from '../Types/auth.types';

const emailSchema = z
  .string()
  .trim()
  .min(1, 'البريد الإلكتروني مطلوب')
  .email('أدخل بريداً إلكترونياً صحيحاً')
  .regex(
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    'يجب أن يحتوي البريد على نطاق صحيح مثل example.com',
  )
  .transform((value) => value.toLowerCase());

export const signupSchema: z.ZodType<SignupRequest> = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(100, 'الاسم طويل جداً'),
  email: emailSchema,
  phone: z
    .string()
    .min(1, 'رقم الهاتف مطلوب')
    .refine((value) => value.replace(/\D/g, '').length <= 15, 'رقم الهاتف طويل جداً')
    .refine(isValidPhoneNumber, 'أدخل رقم هاتف دولي صحيح'),
  country: z.string().length(2, 'الدولة مطلوبة'),
  city: z.string().min(2, 'المدينة مطلوبة').max(30, 'اسم المدينة يجب ألا يتجاوز 30 حرفاً'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل').max(72, 'كلمة المرور طويلة جداً'),
  role: z.enum(['volunteer', 'visually_impired']),
});
