export interface LoginRequest {
  email: string;
  password: string;
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
  logout: () => void;
}

export type LoginFieldErrors = Partial<Record<keyof LoginRequest, string>>;
