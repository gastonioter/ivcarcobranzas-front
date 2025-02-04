import { addToken } from "@/interceptors";
import {
  BajaCustomerFormData,
  CreateCustomerFormData,
  Customer,
  EditCustomerFormData,
} from "@/models/customer";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api",
    prepareHeaders: addToken,
  }),
  tagTypes: ["Customers"],
  endpoints: (builder) => ({
    getCustomers: builder.query<Customer[], void>({
      query: () => "/customers",
      providesTags: ["Customers"],
    }),

    createCustomer: builder.mutation<Customer, CreateCustomerFormData>({
      query: (body) => ({
        url: "/customers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customers"],
    }),

    editCustomer: builder.mutation<Customer, EditCustomerFormData>({
      query: ({ uuid, ...updatedCustomerData }) => ({
        url: `/customers/${uuid}`,
        method: "PATCH",
        body: updatedCustomerData,
      }),
      invalidatesTags: ["Customers"],
    }),

    updateStatus: builder.mutation<Customer, BajaCustomerFormData>({
      query: (body) => ({
        url: `/customers/status`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customers"],
    }),
  }),
});

export const {
  useCreateCustomerMutation,
  useGetCustomersQuery,
  useEditCustomerMutation,
  useUpdateStatusMutation,
} = customerApi;
