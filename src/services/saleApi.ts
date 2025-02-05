import {
  CreateSaleFromData,
  Sale,
  SaleDetailsDTO,
  SaleItemTable,
  SaleStatuses,
  UpdateSaleStatusFormData,
} from "@/models/sale";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
    }),

    createSale: builder.mutation<Sale, CreateSaleFromData>({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Sales"],
    }),

    updateSaleStatus: builder.mutation<Sale, UpdateSaleStatusFormData>({
      query: (body) => ({
        url: "/status",
        method: "POST",
        body,
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
} = saleApi;
