import { z } from 'zod';
import type { SignupRequest } from '../Types/auth.types';

export const signupSchema: z.ZodType<SignupRequest> = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(100, 'الاسم طويل جداً'),
  email: z.email('أدخل بريداً إلكترونياً صحيحاً'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل').max(72, 'كلمة المرور طويلة جداً'),
  role: z.enum(['volunteer', 'visually_impired']),
});
