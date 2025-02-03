import { useAuthToken } from "@/hooks/useAuth";
import { PublicRoutes } from "@/models/routes";
import { Navigate, Outlet } from "react-router";

export default function AuthGuard() {
  const isAuth = useAuthToken();
  
  return isAuth ? (
    <Outlet />
  ) : (
    <Navigate to={`${PublicRoutes.LOGIN}`} replace />
  );
}
