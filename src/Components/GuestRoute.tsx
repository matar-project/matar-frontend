import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Hooks/auth/UseAuth";

export function GuestRoute() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}
