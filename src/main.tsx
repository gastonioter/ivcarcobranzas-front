import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CssBaseline } from "@mui/material";

if (import.meta.env.VITE_ENV != "dev" && location.protocol !== "https:") {
  location.replace(
    `https://${location.hostname}${location.pathname}${location.search}`
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CssBaseline />
    <App />
  </StrictMode>
);
