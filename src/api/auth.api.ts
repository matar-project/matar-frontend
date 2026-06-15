import { apiClient } from './client';
import type { AuthSession, LoginRequest, SignupRequest, SignupResponse } from '../Types/auth.types';

export async function login(credentials: LoginRequest): Promise<AuthSession> {
  const response = await apiClient.post<AuthSession>('/auth/login', credentials);
  return response.data;
}

export async function signup(data: SignupRequest): Promise<SignupResponse> {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('email', data.email);
  formData.append('phone', data.phone);
  formData.append('country', data.country);
  formData.append('city', data.city);
  formData.append('password', data.password);
  formData.append('role', data.role);
  if (data.role === 'visually_impired' && data.healthReport) {
    formData.append('healthReport', data.healthReport, data.healthReport.name);
  }

  const response = await apiClient.post<SignupResponse>(
    '/auth/signup',
    formData,
    { headers: { 'Content-Type': undefined } },
  );
  return response.data;
}

export async function verifyEmailCode(
  signupToken: string,
  email: string,
  code: string,
) {
  return (
    await apiClient.post<AuthSession>('/auth/verify-email-code', {
      signupToken,
      email,
      code,
    })
  ).data;
}

export async function resendEmailCode(signupToken: string) {
  return (
    await apiClient.post<{ message: string }>('/auth/resend-email-code', {
      signupToken,
    })
  ).data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}
