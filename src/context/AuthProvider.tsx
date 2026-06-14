import { useEffect, useState, type ReactNode } from 'react';
import {
  login as loginRequest,
  logout as logoutRequest,
} from '../api/auth.api';
import type {
  AuthSession,
  AuthUser,
  LoginRequest,
} from '../Types/auth.types';
import { AuthContext } from './AuthContext';
import { logger } from '../lib/logger';

interface AuthProviderProps {
  children: ReactNode;
}

function getStoredSession(): AuthSession | null {
  localStorage.removeItem('refreshToken');
  const accessToken = localStorage.getItem('accessToken');
  const storedUser = localStorage.getItem('user');

  if (!accessToken || !storedUser) {
    return null;
  }

  try {
    const stored = JSON.parse(storedUser) as Partial<AuthUser>;
    const user = {
      ...stored,
      status: stored.status ?? 'ACTIVE',
      emailVerified: stored.emailVerified ?? true,
    } as AuthUser;
    logger.info('Session restored from localStorage', { email: user.email, role: user.role });
    return { accessToken, user };
  } catch {
    logger.warn('Corrupt session data in localStorage — clearing');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    return null;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(getStoredSession);

  useEffect(() => {
    const handleRefresh = (event: Event) => {
      setSession((event as CustomEvent<AuthSession>).detail);
    };
    const handleExpired = () => setSession(null);

    window.addEventListener('auth-session-refreshed', handleRefresh);
    window.addEventListener('auth-session-expired', handleExpired);
    return () => {
      window.removeEventListener('auth-session-refreshed', handleRefresh);
      window.removeEventListener('auth-session-expired', handleExpired);
    };
  }, []);

  function persistSession(authSession: AuthSession) {
    localStorage.setItem('accessToken', authSession.accessToken);
    localStorage.removeItem('refreshToken');
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

  async function logout() {
    logger.info('User logged out', { email: session?.user.email });
    try {
      await logoutRequest();
    } catch (error) {
      logger.warn('Server logout failed; clearing the local session', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setSession(null);
    }
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
