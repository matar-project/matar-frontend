export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: 'volunteer' | 'visually_impired';
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface AuthContextValue {
  session: AuthSession | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<AuthSession>;
  loginWithSession: (session: AuthSession) => void;
  logout: () => void;
}

export type LoginFieldErrors = Partial<Record<keyof LoginRequest, string>>;
export type SignupFieldErrors = Partial<Record<keyof SignupRequest, string>>;
