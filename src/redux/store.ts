// app/store.ts
import authReducer from "@/redux/slices/auth";

import { configureStore } from "@reduxjs/toolkit";
import { tokenMiddleware } from "./middlewares";
import { authApi } from "@/services";
import { categoriesApi } from "@/services/categoriesApi";
import { productApi } from "@/services/productApi";
import { customerApi } from "@/services/customerApi";
import { saleApi } from "@/services/saleApi";
import { budgetApi } from "@/services/bidgetApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,

    // generated API reducers here
    [authApi.reducerPath]: authApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [saleApi.reducerPath]: saleApi.reducer,
    [budgetApi.reducerPath]: budgetApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      categoriesApi.middleware,
      productApi.middleware,
      customerApi.middleware,
      saleApi.middleware,
      budgetApi.middleware,
      tokenMiddleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
