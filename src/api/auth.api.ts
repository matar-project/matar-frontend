import { apiClient } from './client';
import type { AuthSession, LoginRequest } from '../Types/auth.types';

export async function login(credentials: LoginRequest): Promise<AuthSession> {
  const response = await apiClient.post<AuthSession>('/auth/login', credentials);
  return response.data;
}
