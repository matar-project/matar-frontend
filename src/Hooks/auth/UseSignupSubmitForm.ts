import axios from 'axios';
import { useState, type FormEvent } from 'react';
import { signup as signupRequest } from '../../api/auth.api';
import { signupSchema } from '../../schema/signup.schema';
import type { SignupFieldErrors, SignupRequest } from '../../Types/auth.types';
import { useAuth } from './UseAuth';
import { logger } from '../../lib/logger';

const initialValues: SignupRequest = {
  name: '',
  email: '',
  password: '',
  role: 'volunteer',
};

function getServerError(error: unknown): string {
  if (!axios.isAxiosError(error)) return 'حدث خطأ. حاول مرة أخرى.';
  const message = error.response?.data?.message;
  if (Array.isArray(message)) return message.join('، ');
  return typeof message === 'string' ? message : 'حدث خطأ. حاول مرة أخرى.';
}

export function useSignupSubmitForm() {
  const { loginWithSession } = useAuth();
  const [values, setValues] = useState<SignupRequest>(initialValues);
  const [errors, setErrors] = useState<SignupFieldErrors>({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof SignupRequest, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setServerError('');
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError('');

    const result = signupSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      logger.warn('Signup form validation failed', fieldErrors);
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        role: fieldErrors.role?.[0],
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const session = await signupRequest(result.data);
      loginWithSession(session);
      logger.info('Signup successful', { email: result.data.email, role: result.data.role });
    } catch (error) {
      const msg = getServerError(error);
      logger.error('Signup failed', msg);
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return { errors, isSubmitting, serverError, submitForm, updateField, values };
}
