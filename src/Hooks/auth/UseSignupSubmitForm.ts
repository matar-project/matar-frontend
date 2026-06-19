import axios from 'axios';
import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { signup as signupRequest } from '../../api/auth.api';
import { signupSchema } from '../../schema/signup.schema';
import type {
  SignupFieldErrors,
  SignupFormValues,
  SignupRequest,
} from '../../Types/auth.types';
import { logger } from '../../lib/logger';

const SIGNUP_ROLES: SignupRequest['role'][] = ['volunteer', 'visually_impired'];

const initialValues: SignupFormValues = {
  name: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  password: '',
  confirmPassword: '',
  role: 'volunteer',
  healthReport: null,
};

function resolveInitialRole(roleParam: string | null): SignupRequest['role'] {
  return SIGNUP_ROLES.find((role) => role === roleParam) ?? initialValues.role;
}

function getServerError(error: unknown): string {
  if (!axios.isAxiosError(error)) return 'حدث خطأ. حاول مرة أخرى.';
  const message = error.response?.data?.message;
  if (Array.isArray(message)) return message.join('، ');
  return typeof message === 'string' ? message : 'حدث خطأ. حاول مرة أخرى.';
}

export function useSignupSubmitForm() {
  const [searchParams] = useSearchParams();
  const [values, setValues] = useState<SignupFormValues>(() => ({
    ...initialValues,
    role: resolveInitialRole(searchParams.get('role')),
  }));
  const [errors, setErrors] = useState<SignupFieldErrors>({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof SignupFormValues, value: string | File | null) {
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
        confirmPassword: fieldErrors.confirmPassword?.[0],
        role: fieldErrors.role?.[0],
        healthReport: fieldErrors.healthReport?.[0],
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // confirmPassword is client-only; strip it before sending to the backend.
      const { confirmPassword: _confirmPassword, ...payload } = result.data;
      const session = await signupRequest(payload);
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
