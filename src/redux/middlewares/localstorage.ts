// app/tokenMiddleware.ts
import { Middleware } from "@reduxjs/toolkit";
import { clearCredentials, setCredentials } from "../slices/auth";
import { removeLocalStorage, setLocalStorage } from "@/utilities/localstorage";

export const tokenMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  if (setCredentials.match(action)) {
    const { token } = action.payload;
    setLocalStorage("auth", token);
    // decode token and set user
  }

  if (clearCredentials.match(action)) {
    removeLocalStorage("auth");
  }

  return result;
};
