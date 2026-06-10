export function getRoleRedirectPath(role: string): string {
  if (role === 'admin') return '/admin';
  if (role === 'coordinator') return '/coordinator';
  if (role === 'volunteer') return '/volunteer-dashboard';
  if (role === 'visually_impired') return '/vi';
  return '/';
}
