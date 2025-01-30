import { PrivateRoutes, Roles } from "@/models/routes";
import { Navigate, Outlet } from "react-router";

interface Props{
    rol:Roles
}

export default function RolGuard({rol}:Props){

    const userRol = 'admin';
    return userRol === rol ? <Outlet /> : <Navigate to={`${PrivateRoutes.PRIVATE}`} replace />;
}