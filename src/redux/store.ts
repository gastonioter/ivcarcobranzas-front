// app/store.ts
import authReducer from "@/redux/slices/auth";

import { authApi } from "@/services";
import { budgetApi } from "@/services/budgetApi";
import { categoriesApi } from "@/services/categoriesApi";
import { cloudCategoryApi } from "@/services/cloudCategoriesApi";
import { cuotasApi } from "@/services/cuotasApi";
import { customerApi } from "@/services/customerApi";
import { metricsApi } from "@/services/metricsApi";
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
    [budgetApi.reducerPath]: budgetApi.reducer,
    [cuotasApi.reducerPath]: cuotasApi.reducer,
    [metricsApi.reducerPath]: metricsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      categoriesApi.middleware,
      productApi.middleware,
      customerApi.middleware,
      saleApi.middleware,
      budgetApi.middleware,
      cloudCategoryApi.middleware,
      cuotasApi.middleware,
      metricsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
