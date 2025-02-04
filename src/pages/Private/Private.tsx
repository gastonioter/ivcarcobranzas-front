import { PrivateRoutes } from "@/models/routes";
import RoutesWithNotFound from "@/utilities/RoutesWithNotFound.utility";
import { Navigate, Route } from "react-router";
import { lazy } from "react";
import { AppLayout } from "./styled-components";
import AppContainer from "./components/AppContainer/AppContainer";
import Categories from "./Categories/Categories";
import Products from "./Products/Products";
import Customers from "./Customers/Customers";
import Sales from "./Sales/Sales";

const Home = lazy(() => import("./Home/Home"));
const Dashboard = lazy(() => import("./Dashboard/Dashboard"));

export default function Private() {
  return (
    <AppLayout>
      <AppContainer>
        <RoutesWithNotFound>
          <Route
            path="/"
            element={<Navigate to={PrivateRoutes.DASHBOARD} />}
          ></Route>
          <Route path={PrivateRoutes.DASHBOARD} element={<Dashboard />}></Route>
          <Route
            path={PrivateRoutes.CATEGORIES}
            element={<Categories />}
          ></Route>
          <Route path={PrivateRoutes.PRODUCTS} element={<Products />}></Route>
          <Route path={PrivateRoutes.SALES} element={<Sales />}></Route>
          <Route path={PrivateRoutes.CUSTOMERS} element={<Customers />}></Route>
          <Route path={PrivateRoutes.RECIPTS} element={<>RECIPTS</>}></Route>
          <Route path={PrivateRoutes.HOME} element={<Home />}></Route>
        </RoutesWithNotFound>
      </AppContainer>
    </AppLayout>
  );
}
