export function getRoleRedirectPath(role: string): string {
  if (role === 'admin') return '/admin';
  if (role === 'volunteer') return '/volunteer';
  if (role === 'visually_impired') return '/vi';
  return '/';
}
