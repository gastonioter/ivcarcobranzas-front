import { PublicRoutes } from "@/models/routes";
import { Navigate, Outlet } from "react-router";

export default function AuthGuard({}) {
  const isAuth = localStorage.getItem("auth");

  return isAuth ? <Outlet /> : <Navigate to={`${PublicRoutes.LOGIN}`} replace />;
}
