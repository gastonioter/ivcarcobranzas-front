import { addToken } from "@/interceptors";
import { CreateSaleFormData, Sale, UpdateSaleFormData } from "@/models/Sale";
import { SalePayment } from "@/models/SalePayment";
import { clearCredentials } from "@/redux/slices";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { customerApi } from "./customerApi";

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

    createSale: builder.mutation<Sale, CreateSaleFormData>({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Sales"],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;

        dispatch(customerApi.util.invalidateTags(["AccountSummary"]));
      },
    }),

    updateSale: builder.mutation<Sale, UpdateSaleFormData>({
      query: ({ uuid, ...body }) => ({
        url: `/${uuid}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Sales"],

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;

        dispatch(customerApi.util.invalidateTags(["AccountSummary"]));
      },
    }),

    /* SALE PAYMENTS APIs */

    getSalePayments: builder.query<SalePayment[], string>({
      query: (saleID) => `/${saleID}/payments`,
      providesTags: ["Sales"],
    }),
  }),
});

export const {
  useGetSalesQuery,
  useCreateSaleMutation,
  useGetSaleQuery,
  useGetSalePaymentsQuery,
  useUpdateSaleMutation,
} = saleApi;
