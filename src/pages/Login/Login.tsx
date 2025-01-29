import { useEffect } from "react";
import { useNavigate } from "react-router";
import { LoginForm } from "./components";

export const Login = () => {
  const navigate = useNavigate();

  console.log("login page");
  useEffect(() => {
    const token = localStorage.getItem("auth") || null;

    if (token) {
      navigate("/dashboard");
    }
  }, []);

  return <LoginForm />;
};
