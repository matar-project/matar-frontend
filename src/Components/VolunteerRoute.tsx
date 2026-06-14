import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Hooks/auth/UseAuth';

export function VolunteerRoute() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'volunteer') return <Navigate to="/" replace />;
  if (user.status !== 'ACTIVE') return <Navigate to="/login" replace />;

  return <Outlet />;
}
