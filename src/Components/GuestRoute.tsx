import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Hooks/auth/UseAuth";
import { getAccountRedirectPath } from "../lib/roleRedirect";

export function GuestRoute() {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to={getAccountRedirectPath(user)} replace />;
  }

  return <Outlet />;
}
