import { PrivateRoutes } from "@/models/routes";
import RoutesWithNotFound from "@/utilities/RoutesWithNotFound.utility";
import { lazy } from "react";
import { Navigate, Route } from "react-router";
import BudgetDetails from "./(Transactions)/Budgets/BudgetDetails/BudgetDetails";
import Budgets from "./(Transactions)/Budgets/Budgets";

import NewBudget from "./(Transactions)/Budgets/NewBudget/NewBudget";
import NewSale from "./(Transactions)/Sales/NewSale/NewSale";
import SaleDetails from "./(Transactions)/Sales/SaleDetails/SaleDetails";
import Sales from "./(Transactions)/Sales/Sales";
import Categories from "./Categories/Categories";
import AppContainer from "./components/AppContainer/AppContainer";
import Customers from "./Customers/Customers";
import Products from "./Products/Products";

import SalePayments from "./(Transactions)/Sales/SalePayments/SalePayments";
import Cuotas from "./Cuotas/Cuotas";
import NewCuota from "./Cuotas/NewCuota/NewCuota";
import Payments from "./Payments/Payments";
import { AppLayout } from "./styled-components";
import NewPayment from "./Payments/NewPayment/NewPayment";

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

          {/* CATALOGO */}

          <Route
            path={PrivateRoutes.CATEGORIES}
            element={<Categories />}
          ></Route>
          <Route path={PrivateRoutes.PRODUCTS} element={<Products />}></Route>

          {/* BUDGETS - NEW- DETAILS */}
          <Route
            path={`${PrivateRoutes.BUDGETS}/`}
            element={<Budgets />}
          ></Route>
          <Route
            path={`presupuestos/${PrivateRoutes.NEW_BUDGET}/`}
            element={<NewBudget />}
          ></Route>
          <Route
            path={`${PrivateRoutes.DETAIL_BUDGET}/`}
            element={<BudgetDetails />}
          ></Route>

          {/* SALES - NEW - DETAILS  - PAYMENTS */}

          <Route path={PrivateRoutes.SALES} element={<Sales />}></Route>
          <Route
            path={`ventas/${PrivateRoutes.NEW_SALE}/`}
            element={<NewSale />}
          ></Route>
          <Route
            path={`${PrivateRoutes.DETAIL_SALE}`}
            element={<SaleDetails />}
          ></Route>

          <Route
            path={`ventas/${PrivateRoutes.PAYMENTS_SALE}`}
            element={<SalePayments />}
          ></Route>
          {/* CUSTOEMRS */}

          <Route path={PrivateRoutes.CUSTOMERS} element={<Customers />}></Route>

          <Route path={`${PrivateRoutes.CUOTAS}`} element={<Cuotas />}></Route>

          <Route
            path={`cuotas/${PrivateRoutes.NEW_CUOTA}`}
            element={<NewCuota />}
          ></Route>

          <Route path={PrivateRoutes.PAYMENTS} element={<Payments />}></Route>
          <Route
            path={`pagos/${PrivateRoutes.NEW_PAYMENT}`}
            element={<NewPayment />}
          ></Route>
        </RoutesWithNotFound>
      </AppContainer>
    </AppLayout>
  );
}
