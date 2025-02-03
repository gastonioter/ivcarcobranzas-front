// features/api/authApi.ts
import { RootState } from "@/redux";
import { setCredentials } from "@/redux/slices/auth";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api/auth",

    prepareHeaders: (headers, { getState }) => {
      // Puedes obtener el token desde el estado y agregarlo a headers si es necesario
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ token: data.token }));
        } catch (err) {
          console.error("Error en login:", err);
        }
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
