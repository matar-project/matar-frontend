import axios from 'axios';
import { useState, type FormEvent } from 'react';
import { signupSchema } from '../../schema/signup.schema';
import type {
  SignupFieldErrors,
  SignupRequest,
} from '../../Types/auth.types';
import { useAuth } from './UseAuth';

const initialValues: SignupRequest = {
  name: '',
  email: '',
  password: '',
  role: 'volunteer',
};

function getServerError(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return 'Unable to create your account. Please try again.';
  }

  const message = error.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(', ');
  }

  return typeof message === 'string'
    ? message
    : 'Unable to create your account. Please try again.';
}

export function useSignupSubmitForm() {
  const { signup } = useAuth();
  const [values, setValues] = useState<SignupRequest>(initialValues);
  const [errors, setErrors] = useState<SignupFieldErrors>({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<Field extends keyof SignupRequest>(
    field: Field,
    value: SignupRequest[Field],
  ) {
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
      await signup(result.data);
    } catch (error) {
      setServerError(getServerError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    errors,
    isSubmitting,
    serverError,
    submitForm,
    updateField,
    values,
  };
}
