import { addToken } from "@/interceptors";
import { Sale } from "@/models/Sale";
import { TransactionFormData } from "@/models/Transaction";
import { clearCredentials } from "@/redux/slices";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_API_URL}/sales`,
    prepareHeaders: addToken,
  })(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(clearCredentials());
  }

  return result;
};

export const saleApi = createApi({
  reducerPath: "saleApi",
  baseQuery,
  tagTypes: ["Sales"],

  endpoints: (builder) => ({
    getSales: builder.query<Sale[], void>({
      query: () => "/",
      providesTags: ["Sales"],
    }),

    getSale: builder.query<Sale, string>({
      query: (uuid) => `/${uuid}`,
      providesTags: ["Sales"],
    }),

    createSale: builder.mutation<Sale, TransactionFormData>({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Sales"],
    }),
  }),
});

export const { useGetSalesQuery, useCreateSaleMutation, useGetSaleQuery } =
  saleApi;
