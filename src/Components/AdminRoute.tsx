import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Hooks/auth/UseAuth';

export function AdminRoute() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;

  return <Outlet />;
}
