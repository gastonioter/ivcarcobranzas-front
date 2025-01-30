import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route } from "react-router-dom";
import AuthGuard from "./guards/auth.guard";
import { PrivateRoutes, PublicRoutes } from "./models/routes";
import RoutesWithNotFound from "./utilities/RoutesWithNotFound.utility";

const Login = lazy(() => import("./pages/Login/Login"));
const Private = lazy(() => import("./pages/Private/Private"));

function App() {
  // const isAuth = localStorage.getItem("auth");
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <RoutesWithNotFound>
          <Route
            path="/"
            element={<Navigate to={PrivateRoutes.PRIVATE} />}
          ></Route>
          <Route path={`${PublicRoutes.LOGIN}`} element={<Login />}></Route>

          <Route element={<AuthGuard />}>
            <Route
              path={`${PrivateRoutes.PRIVATE}/*`}
              element={<Private />}
            ></Route>
          </Route>
        </RoutesWithNotFound>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
