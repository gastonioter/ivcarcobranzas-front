// app/store.ts
import authReducer from "@/redux/slices/auth";

import { configureStore } from "@reduxjs/toolkit";
import { tokenMiddleware } from "./middlewares";
import { authApi } from "@/services";
import { categoriesApi } from "@/services/categoriesApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      categoriesApi.middleware,
      tokenMiddleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
