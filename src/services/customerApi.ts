import { addToken } from "@/interceptors";
import {
  CreateCustomerFormData,
  Customer,
  EditCustomerFormData,
} from "@/models/customer";
import { clearCredentials } from "@/redux/slices";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = async (args: any, api: any, extraOptions: any) => {
  const result = await fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_API_URL}/customers`,
    prepareHeaders: addToken,
  })(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(clearCredentials());
  }

  return result;
};

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery,
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

    editCustomer: builder.mutation<Customer, EditCustomerFormData>({
      query: ({ uuid, ...updatedCustomerData }) => ({
        url: `/${uuid}`,
        method: "PATCH",
        body: updatedCustomerData,
      }),
      invalidatesTags: ["Customers"],
    }),

    updateStatus: builder.mutation<Customer, ChangeStatusFormData>({
      query: (body) => ({
        url: `/status`,
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
