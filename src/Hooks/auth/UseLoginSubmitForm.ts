import axios from "axios";
import { useState, type FormEvent } from "react";
import { loginSchema } from "../../schema/login.schema";
import type { LoginFieldErrors, LoginRequest } from "../../Types/auth.types";
import { useAuth } from "./UseAuth";
import { logger } from "../../lib/logger";

const initialValues: LoginRequest = {
  email: '',
  password: '',
};

function getServerError(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return 'Unable to sign in. Please try again.';
  }

  const message = error.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(', ');
  }

  return typeof message === 'string'
    ? message
    : 'Unable to sign in. Please try again.';
}

export function useLoginSubmitForm() {
  const { login, session } = useAuth();
  const [values, setValues] = useState<LoginRequest>(initialValues);
  const [errors, setErrors] = useState<LoginFieldErrors>({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof LoginRequest, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setServerError('');
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError('');

    const result = loginSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      logger.warn('Login form validation failed', fieldErrors);
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      return await login(result.data);
    } catch (error) {
      const msg = getServerError(error);
      logger.error('Login failed', msg);
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    errors,
    isSubmitting,
    serverError,
    session,
    submitForm,
    updateField,
    values,
  };
}
