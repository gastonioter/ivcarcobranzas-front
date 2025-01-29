import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PrivateRouteGuard } from "./components/private-route-guard";
import { Login } from "./pages";
import Dashboard from "./pages/Dashboard/Dashboard";
import LoginLayout from "./layouts/login.layout";
import AppLayout from "./layouts/app.layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LoginLayout />}>
          <Route path="/" element={<Login />}></Route>
        </Route>

        <Route element={<PrivateRouteGuard />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
