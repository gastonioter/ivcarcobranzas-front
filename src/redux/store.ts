// app/store.ts
import authReducer from "@/redux/slices/auth";
import { authApi } from "@/services/auth";
import { configureStore } from "@reduxjs/toolkit";
import { tokenMiddleware } from "./middlewares/localstorage";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, tokenMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
