import { PrivateRoutes } from "@/models/routes";
import RoutesWithNotFound from "@/utilities/RoutesWithNotFound.utility";
import { Navigate, Route } from "react-router";
import { lazy } from "react";
import { AppLayout } from "./styled-components";

const Home = lazy(() => import("./Home/Home"));
const Dashboard = lazy(() => import("./Dashboard/Dashboard"));

export default function Private() {
  return (
    <AppLayout>
      <RoutesWithNotFound>
        <Route
          path="/"
          element={<Navigate to={PrivateRoutes.DASHBOARD} />}
        ></Route>
        <Route path={PrivateRoutes.DASHBOARD} element={<Dashboard />}></Route>
        <Route path={PrivateRoutes.HOME} element={<Home />}></Route>
      </RoutesWithNotFound>
    </AppLayout>
  );
}
