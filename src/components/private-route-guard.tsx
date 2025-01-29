import { Navigate, Outlet } from "react-router";

export const PrivateRouteGuard = () => {
  const isAuth = true;
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};
