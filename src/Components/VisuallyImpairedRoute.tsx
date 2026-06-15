import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Hooks/auth/UseAuth';

export function VisuallyImpairedRoute() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'visually_impired') return <Navigate to="/" replace />;
  if (user.status !== 'ACTIVE') {
    return <Navigate to={user.status === 'REJECTED' ? '/account-rejected' : '/account-pending'} replace />;
  }

  return <Outlet />;
}
