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
import SaleForm from "./Sales/components/SaleForm/SaleForm";
import NewSale from "./Sales/NewSale/NewSale";

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
          <Route
            path={`ventas/${PrivateRoutes.NEW_SALE}`}
            element={<NewSale />}
          ></Route>
          <Route
            path={PrivateRoutes.DETAIL_SALE}
            element={<SaleForm />}
          ></Route>
          <Route path={PrivateRoutes.CUSTOMERS} element={<Customers />}></Route>
          <Route
            path={PrivateRoutes.MONTHLY_FEES}
            element={<>RECIPTS</>}
          ></Route>
          <Route path={PrivateRoutes.PAYMENTS} element={<Home />}></Route>
        </RoutesWithNotFound>
      </AppContainer>
    </AppLayout>
  );
}
