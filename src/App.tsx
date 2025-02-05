import { Suspense, lazy } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route } from "react-router-dom";
import AuthGuard from "./guards/auth.guard";
import { PrivateRoutes, PublicRoutes } from "./models/routes";
import { store } from "./redux";
import RoutesWithNotFound from "./utilities/RoutesWithNotFound.utility";
import { ThemeProvider } from "styled-components";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import theme from "./theme";
import SnackbarProvider from "./context/SnackbarContext";
import LoadingState from "./components/LoadingState/LoadingState";

const Login = lazy(() => import("./pages/Login/Login"));
const Private = lazy(() => import("./pages/Private/Private"));

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <Suspense fallback={<LoadingState />}>
          <Provider store={store}>
            <SnackbarProvider>
              <BrowserRouter>
                <RoutesWithNotFound>
                  <Route
                    path="/"
                    element={<Navigate to={PrivateRoutes.PRIVATE} />}
                  ></Route>
                  <Route
                    path={`${PublicRoutes.LOGIN}`}
                    element={<Login />}
                  ></Route>

                  <Route element={<AuthGuard />}>
                    <Route
                      path={`${PrivateRoutes.PRIVATE}/*`}
                      element={<Private />}
                    ></Route>
                  </Route>
                </RoutesWithNotFound>
              </BrowserRouter>
            </SnackbarProvider>
          </Provider>
        </Suspense>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}

export default App;
