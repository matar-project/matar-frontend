import { useState, type ReactNode } from 'react';
import { login as loginRequest } from '../api/auth.api';
import type {
  AuthSession,
  AuthUser,
  LoginRequest,
} from '../Types/auth.types';
import { AuthContext } from './AuthContext';

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
    return { accessToken, refreshToken, user };
  } catch {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    return null;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(getStoredSession);

  async function login(credentials: LoginRequest) {
    const authSession = await loginRequest(credentials);

    localStorage.setItem('accessToken', authSession.accessToken);
    localStorage.setItem('refreshToken', authSession.refreshToken);
    localStorage.setItem('user', JSON.stringify(authSession.user));
    setSession(authSession);

    return authSession;
  }

  function logout() {
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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
