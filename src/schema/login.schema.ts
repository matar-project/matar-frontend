import { z } from 'zod';
import type { LoginRequest } from '../Types/auth.types';

export const loginSchema: z.ZodType<LoginRequest> = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
