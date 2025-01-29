import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./pages";
import Dashboard from "./pages/Dashboard/Dashboard";
import { PrivateRouteGuard } from "./components/private-route-guard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>

        <Route element={<PrivateRouteGuard />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
