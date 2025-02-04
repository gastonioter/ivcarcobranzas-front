import { addToken } from "@/interceptors";
import { CreateCustomerFormData, Customer } from "@/models/customer";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api/customers",
    prepareHeaders: addToken,
  }),
  tagTypes: ["Customers"],
  endpoints: (builder) => ({
    getCustomers: builder.query<Customer[], void>({
      query: () => "/",
      providesTags: ["Customers"],
    }),

    createCustomer: builder.mutation<Customer, CreateCustomerFormData>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customers"],
    }),
  }),
});

export const { useCreateCustomerMutation, useGetCustomersQuery } = customerApi;
