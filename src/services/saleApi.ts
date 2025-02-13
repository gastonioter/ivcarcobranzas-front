import { addToken } from "@/interceptors";
import {
  AddSalePaymentFormData,
  CreateSaleFromData,
  Transaction,
  SaleDetailsDTO,
  SaleDTO,
  SalePayment,
  SalePaymentStatuses,
  UpdateSaleStatusFormData,
} from "@/models/sale";
import { clearCredentials } from "@/redux/slices";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface UpdatePaymentArgs {
  saleID: string;
  paymentID: string;
  status: SalePaymentStatuses;
}
interface CreatePaymentArgs {
  uuid: string;
  data: AddSalePaymentFormData;
}

const baseQuery = async (args: any, api: any, extraOptions: any) => {
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
    getSales: builder.query<SaleDTO[], void>({
      query: () => "/",
      providesTags: ["Sales"],
    }),

    getSale: builder.query<SaleDetailsDTO, string>({
      query: (uuid) => `/${uuid}`,
      providesTags: ["Sales"],
    }),

    getSalePayments: builder.query<SalePayment[], string>({
      query: (uuid) => `/${uuid}/payments`,
      providesTags: ["Sales"],
    }),

    createSale: builder.mutation<Transaction, CreateSaleFromData>({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Sales"],
    }),

    updateSaleStatus: builder.mutation<Transaction, UpdateSaleStatusFormData>({
      query: (body) => ({
        url: "/status",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sales"],
    }),

    updateSalePaymentStatus: builder.mutation<Transaction, UpdatePaymentArgs>({
      query: ({ saleID, paymentID, status }) => ({
        url: `${saleID}/payments/${paymentID}/`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Sales"],
    }),

    createPaymentForSale: builder.mutation<Transaction, CreatePaymentArgs>({
      query: ({ uuid, data }) => ({
        url: `/${uuid}/payments`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Sales"],
    }),
  }),
});

export const {
  useGetSalesQuery,
  useCreateSaleMutation,
  useGetSaleQuery,
  useUpdateSaleStatusMutation,
  useCreatePaymentForSaleMutation,
  useGetSalePaymentsQuery,
  useUpdateSalePaymentStatusMutation,
} = saleApi;
