// features/api/authApi.ts
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
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001/api/auth" }),

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
