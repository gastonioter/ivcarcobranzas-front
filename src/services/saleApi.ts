import {
  AddSalePaymentFormData,
  CreateSaleFromData,
  Transaction,
  SaleDetailsDTO,
  SaleItemTable,
  SalePayment,
  SalePaymentStatuses,
  UpdateSaleStatusFormData,
} from "@/models/sale";
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

export const saleApi = createApi({
  reducerPath: "saleApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001/api/sales" }),
  tagTypes: ["Sales"],

  endpoints: (builder) => ({
    getSales: builder.query<SaleItemTable[], void>({
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
