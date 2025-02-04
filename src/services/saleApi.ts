import { CreateSaleFromData, Sale, SaleItemTable } from "@/models/sale";
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

    createSale: builder.mutation<Sale, CreateSaleFromData>({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Sales"],
    }),
  }),
});

export const { useGetSalesQuery, useCreateSaleMutation } = saleApi;
