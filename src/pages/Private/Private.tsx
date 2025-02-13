import { PrivateRoutes } from "@/models/routes";
import RoutesWithNotFound from "@/utilities/RoutesWithNotFound.utility";
import { lazy } from "react";
import { Navigate, Route } from "react-router";
import NewBudget from "./(Transactions)/Budgets/NewBudget/NewBudget";
import NewSale from "./(Transactions)/Sales/NewSale/NewSale";
import Budgets from "./Budgets/Budgets";
import Categories from "./Categories/Categories";
import AppContainer from "./components/AppContainer/AppContainer";
import Customers from "./Customers/Customers";
import Products from "./Products/Products";
import DetailSale from "./Sales/DetailSale/DetailSale";
import SalePaymentsManagment from "./Sales/SalePaymentsManagment/SalePaymentsManagment";
import Sales from "./Sales/Sales";
import { AppLayout } from "./styled-components";

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
            path={`${PrivateRoutes.BUDGETS}/`}
            element={<Budgets />}
          ></Route>
          <Route
            path={`presupuestos/${PrivateRoutes.NEW_BUDGET}/`}
            element={<NewBudget />}
          ></Route>
          <Route
            path={`ventas/${PrivateRoutes.NEW_SALE}/`}
            element={<NewSale />}
          ></Route>
          <Route
            path={`ventas/${PrivateRoutes.DETAIL_SALE}`}
            element={<DetailSale />}
          ></Route>

          <Route
            path={`ventas/${PrivateRoutes.PAYMENTS_SALE}`}
            element={<SalePaymentsManagment />}
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
