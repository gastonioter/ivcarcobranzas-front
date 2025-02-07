import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const budgetApi = createApi({
  reducerPath: "budgetApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001/api" }),
  tagTypes: ["Budget"],
  endpoints: (builder) => ({
    createBudget: builder.mutation({
      query: (body) => ({
        url: "/budget",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Budget"],
    }),

    getBudgets: builder.query({
      query: () => "/budget",
      providesTags: ["Budget"],
    }),
  }),
});

export const { useCreateBudgetMutation, useGetBudgetsQuery } = budgetApi;
