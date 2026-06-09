import { z } from 'zod';
import type { SignupRequest } from '../Types/auth.types';

export const signupSchema: z.ZodType<SignupRequest> = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  email: z.email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters'),
  role: z.enum(['volunteer', 'visually_impired']),
});
