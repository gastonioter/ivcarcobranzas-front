import { addToken } from "@/interceptors";
import { Budget, BudgetFormData } from "@/models/Budget";
import { clearCredentials } from "@/redux/slices";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_API_URL}/budgets`,
    prepareHeaders: addToken,
  })(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(clearCredentials());
  }

  return result;
};
export const budgetApi = createApi({
  reducerPath: "budgetApi",
  baseQuery,
  tagTypes: ["Budget"],
  endpoints: (builder) => ({
    getBudgets: builder.query<Budget[], void>({
      query: () => "/",
      providesTags: ["Budget"],
    }),

    createBudget: builder.mutation<Budget, BudgetFormData>({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Budget"],
    }),
  }),
});
