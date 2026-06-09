import { apiClient } from './client';
import type { AuthSession, LoginRequest, SignupRequest } from '../Types/auth.types';

export async function login(credentials: LoginRequest): Promise<AuthSession> {
  const response = await apiClient.post<AuthSession>('/auth/login', credentials);
  return response.data;
}

export async function signup(data: SignupRequest): Promise<AuthSession> {
  const response = await apiClient.post<AuthSession>('/auth/signup', data);
  return response.data;
}
