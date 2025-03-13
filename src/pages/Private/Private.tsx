import { PrivateRoutes } from "@/models/routes";
import RoutesWithNotFound from "@/utilities/RoutesWithNotFound.utility";
import { lazy } from "react";
import { Navigate, Route } from "react-router";
import AppContainer from "./components/AppContainer/AppContainer";
import { AppLayout } from "./styled-components";

const Dashboard = lazy(() => import("./Dashboard/Dashboard"));
const Customers = lazy(() => import("./Customers/Customers"));
const Products = lazy(() => import("./Products/Products"));
const Cuotas = lazy(() => import("./Cuotas/Cuotas"));
const Payments = lazy(() => import("./Payments/Payments"));
const Sales = lazy(() => import("./(Transactions)/Sales/Sales"));
const NewSale = lazy(() => import("./(Transactions)/Sales/NewSale/NewSale"));
const SaleDetails = lazy(
  () => import("./(Transactions)/Sales/SaleDetails/SaleDetails")
);
const SalePayments = lazy(
  () => import("./(Transactions)/Sales/SalePayments/SalePayments")
);
const Categories = lazy(() => import("./Categories/Categories"));
const Budgets = lazy(() => import("./(Transactions)/Budgets/Budgets"));
const NewBudget = lazy(
  () => import("./(Transactions)/Budgets/NewBudget/NewBudget")
);
const BudgetDetails = lazy(
  () => import("./(Transactions)/Budgets/BudgetDetails/BudgetDetails")
);
const NewCuota = lazy(() => import("./Cuotas/NewCuota/NewCuota"));
const NewPayment = lazy(() => import("./Payments/NewPayment/NewPayment"));

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
