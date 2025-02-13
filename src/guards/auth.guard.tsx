import { useAuthToken } from "@/hooks/useAuth";
import { PublicRoutes } from "@/models/routes";
import { isTokenExpired } from "@/utilities/validateTokenExpiration";
import { Navigate, Outlet } from "react-router";

export default function AuthGuard() {
  const isAuth = useAuthToken();

  return isAuth && !isTokenExpired(isAuth) ? (
    <Outlet />
  ) : (
    <Navigate to={`${PublicRoutes.LOGIN}`} replace />
  );
}
