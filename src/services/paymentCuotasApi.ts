import { addToken } from "@/interceptors";
import {
  CreatePaymentForCuotasPayload,
  CuotaPayment,
  CuotaPaymentFilters,
} from "@/models/CuotaPayment";
import { clearCredentials } from "@/redux/slices/auth";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { metricsApi } from "./metricsApi";
import { cuotasApi } from "./cuotasApi";

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_API_URL}/cuota-payments`,
    prepareHeaders: addToken,
  })(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(clearCredentials());
  }

  return result;
};

export const cuotaPaymentsApi = createApi({
  reducerPath: "cuotaPaymentsApi",
  baseQuery,
  tagTypes: ["CuotaPayments"],

  endpoints: (builder) => ({
    getPayments: builder.query<CuotaPayment[], CuotaPaymentFilters>({
      query: (filters) => ({
        url: "/",
        method: "GET",
        params: filters,
      }),
      providesTags: (res, err, args) => [
        { type: "CuotaPayments", id: "LIST" },
        { type: "CuotaPayments", id: `filters_${JSON.stringify(args)}` },
      ],
    }),

    payCuotas: builder.mutation<CuotaPayment, CreatePaymentForCuotasPayload>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: (res, err, body) => [
        {
          type: "CuotaPayments",
          id: `filters_${JSON.stringify({ customerId: body.customerId })}`,
        },
      ],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(metricsApi.util.invalidateTags(["Metrics"]));
        dispatch(cuotasApi.util.invalidateTags(["Cuotas"]));
      },
    }),
  }),
});

export const { usePayCuotasMutation, useGetPaymentsQuery } = cuotaPaymentsApi;
