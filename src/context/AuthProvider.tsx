import { useState, type ReactNode } from 'react';
import {
  login as loginRequest,
  signup as signupRequest,
} from '../api/auth.api';
import type {
  AuthSession,
  AuthUser,
  LoginRequest,
  SignupRequest,
} from '../Types/auth.types';
import { AuthContext } from './AuthContext';
import { logger } from '../lib/logger';

interface AuthProviderProps {
  children: ReactNode;
}

function getStoredSession(): AuthSession | null {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const storedUser = localStorage.getItem('user');

  if (!accessToken || !refreshToken || !storedUser) {
    return null;
  }

  try {
    const user = JSON.parse(storedUser) as AuthUser;
    logger.info('Session restored from localStorage', { email: user.email, role: user.role });
    return { accessToken, refreshToken, user };
  } catch {
    logger.warn('Corrupt session data in localStorage — clearing');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    return null;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(getStoredSession);

  function persistSession(authSession: AuthSession) {
    localStorage.setItem('accessToken', authSession.accessToken);
    localStorage.setItem('refreshToken', authSession.refreshToken);
    localStorage.setItem('user', JSON.stringify(authSession.user));
    setSession(authSession);
  }

  async function login(credentials: LoginRequest) {
    logger.info('Login attempt', { email: credentials.email });
    const authSession = await loginRequest(credentials);
    persistSession(authSession);
    logger.info('Login successful', { email: authSession.user.email, role: authSession.user.role });
    return authSession;
  }

  function loginWithSession(authSession: AuthSession) {
    persistSession(authSession);
    logger.info('Session set directly', { email: authSession.user.email, role: authSession.user.role });
  }

  function logout() {
    logger.info('User logged out', { email: session?.user.email });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isAuthenticated: Boolean(session),
        login,
        loginWithSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
