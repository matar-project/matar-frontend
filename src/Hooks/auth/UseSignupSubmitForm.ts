import axios from 'axios';
import { useState, type FormEvent } from 'react';
import { signup as signupRequest } from '../../api/auth.api';
import { signupSchema } from '../../schema/signup.schema';
import type { SignupFieldErrors, SignupRequest } from '../../Types/auth.types';
import { logger } from '../../lib/logger';

const initialValues: SignupRequest = {
  name: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  password: '',
  role: 'volunteer',
  healthReport: null,
};

function getServerError(error: unknown): string {
  if (!axios.isAxiosError(error)) return 'حدث خطأ. حاول مرة أخرى.';
  const message = error.response?.data?.message;
  if (Array.isArray(message)) return message.join('، ');
  return typeof message === 'string' ? message : 'حدث خطأ. حاول مرة أخرى.';
}

export function useSignupSubmitForm() {
  const [values, setValues] = useState<SignupRequest>(initialValues);
  const [errors, setErrors] = useState<SignupFieldErrors>({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof SignupRequest, value: string | File | null) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setServerError('');
  }

  function validateField(field: keyof SignupRequest) {
    const result = signupSchema.safeParse(values);
    const message = result.success
      ? undefined
      : result.error.flatten().fieldErrors[field]?.[0];
    setErrors((current) => ({ ...current, [field]: message }));
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
        phone: fieldErrors.phone?.[0],
        country: fieldErrors.country?.[0],
        city: fieldErrors.city?.[0],
        password: fieldErrors.password?.[0],
        role: fieldErrors.role?.[0],
        healthReport: fieldErrors.healthReport?.[0],
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const session = await signupRequest(result.data);
      logger.info('Signup successful', { email: result.data.email, role: result.data.role });
      return session;
    } catch (error) {
      const msg = getServerError(error);
      logger.error('Signup failed', msg);
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return { errors, isSubmitting, serverError, submitForm, updateField, validateField, values };
}
