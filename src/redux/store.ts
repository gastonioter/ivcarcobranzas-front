// app/store.ts
import authReducer from "@/redux/slices/auth";

import { authApi } from "@/services";
import { categoriesApi } from "@/services/categoriesApi";
import { cloudCategoryApi } from "@/services/cloudCategoriesApi";
import { customerApi } from "@/services/customerApi";
import { productApi } from "@/services/productApi";
import { saleApi } from "@/services/saleApi";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    auth: authReducer,

    [authApi.reducerPath]: authApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [saleApi.reducerPath]: saleApi.reducer,
    [cloudCategoryApi.reducerPath]: cloudCategoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      categoriesApi.middleware,
      productApi.middleware,
      customerApi.middleware,
      saleApi.middleware,
      cloudCategoryApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
