import api from '../config/axios.config';
import type { AuthSession, LoginRequest } from '../Types/auth.types';

export async function login(credentials: LoginRequest): Promise<AuthSession> {
  const response = await api.post<AuthSession>('/auth/login', credentials);
  return response.data;
}
