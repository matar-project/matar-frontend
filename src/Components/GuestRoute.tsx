import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Hooks/auth/UseAuth";
import { getRoleRedirectPath } from "../lib/roleRedirect";

export function GuestRoute() {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to={getRoleRedirectPath(user.role)} replace />;
  }

  return <Outlet />;
}
