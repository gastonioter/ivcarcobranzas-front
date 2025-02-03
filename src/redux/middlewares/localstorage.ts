// app/tokenMiddleware.ts
import { Middleware } from "@reduxjs/toolkit";
import { clearCredentials, setCredentials } from "../slices/auth";

export const tokenMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  if (setCredentials.match(action)) {
    const { token } = action.payload;
    localStorage.setItem("auth", token);
  }

  if (clearCredentials.match(action)) {
    localStorage.removeItem("auth");
  }

  return result;
};
