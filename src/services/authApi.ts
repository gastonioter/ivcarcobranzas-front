// features/api/authApi.ts
import { BASE_URL } from "@/constants/baseURL";
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
    baseUrl: `${BASE_URL}/auth`,
  }),

  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
