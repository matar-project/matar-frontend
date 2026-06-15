import type { AuthUser } from '../Types/auth.types';

export function getRoleRedirectPath(role: string): string {
  if (role === 'admin') return '/admin';
  if (role === 'coordinator') return '/coordinator';
  if (role === 'volunteer') return '/volunteer-dashboard';
  if (role === 'visually_impired') return '/vi';
  return '/';
}

export function getAccountRedirectPath(user: AuthUser): string {
  if (!user.emailVerified || user.status === 'EMAIL_VERIFICATION_PENDING') return '/verify-email';
  if (user.status === 'PENDING_ADMIN_REVIEW') return '/account-pending';
  if (user.status === 'REJECTED') return '/account-rejected';
  return getRoleRedirectPath(user.role);
}
