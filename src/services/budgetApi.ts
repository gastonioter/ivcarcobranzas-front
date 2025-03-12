import { addToken } from "@/interceptors";
import {
  Budget,
  BudgetFormData,
  BudgetStatus,
  UpdateBudgetFormData,
} from "@/models/Budget";
import { clearCredentials } from "@/redux/slices";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { saleApi } from "./saleApi";

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

    getBudget: builder.query<Budget, string>({
      query: (uuid) => `/${uuid}`,
      providesTags: ["Budget"],
    }),

    updateBudgetStatus: builder.mutation<Budget, UpdateBudgetFormData>({
      query: ({ uuid, status }) => ({
        url: `/${uuid}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Budget"],
      onQueryStarted: async ({ status }, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        if (status === BudgetStatus.APPROVED) {
          dispatch(saleApi.util.invalidateTags(["Sales"]));
        }
      },
    }),
  }),
  refetchOnReconnect: true,
});

export const {
  useGetBudgetsQuery,
  useCreateBudgetMutation,
  useUpdateBudgetStatusMutation,
  useGetBudgetQuery,
} = budgetApi;
