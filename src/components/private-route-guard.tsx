import { Navigate, Outlet } from "react-router";

export const PrivateRouteGuard = () => {
  const isAuth = localStorage.getItem("auth");
  console.log(isAuth);
  return isAuth ? <Outlet /> : <Navigate to="/" replace />;
};
