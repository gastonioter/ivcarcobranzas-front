import { Navigate, useNavigate } from "react-router";

export const Login = () => {
  const navigate = useNavigate();
  const isAuth = false;

  if (isAuth) return <Navigate to="/dashboard" replace />;

  const handleLogin = () => {
    localStorage.setItem("auth", "true");
    navigate("/dashboard");
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleLogin}>Iniciar Sesión</button>
    </div>
  );
};
