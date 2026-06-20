export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  password: string;
  role: 'volunteer' | 'visually_impired';
  healthReport: File | null;
}

export type AccountStatus =
  | 'EMAIL_VERIFICATION_PENDING'
  | 'PENDING_ADMIN_REVIEW'
  | 'ACTIVE'
  | 'REJECTED'
  | 'SUSPENDED';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  city: string | null;
  role: string;
  status: AccountStatus;
  emailVerified: boolean;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
}

export interface SignupResponse {
  email: string;
  signupToken: string;
  accountType: string;
  status: AccountStatus;
  message: string;
}

export interface AuthContextValue {
  session: AuthSession | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<AuthSession>;
  loginWithSession: (session: AuthSession) => void;
  logout: () => Promise<void>;
}

// confirmPassword is a client-only field (never sent to the backend).
export type SignupFormValues = SignupRequest & { confirmPassword: string };

export type LoginFieldErrors = Partial<Record<keyof LoginRequest, string>>;
export type SignupFieldErrors = Partial<Record<keyof SignupFormValues, string>>;
