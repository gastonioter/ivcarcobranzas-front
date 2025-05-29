import { addToken } from "@/interceptors";
import {
  AccountSummary,
  CreateCustomerFormData,
  Customer,
  EditCustomerFormData,
  UpdateStatusFormData,
} from "@/models/customer";
import { Payment } from "@/models/Payment";
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
  tagTypes: ["Customers", "AccountSummary", "Customer"],
  endpoints: (builder) => ({
    getCustomers: builder.query<Customer[], void>({
      query: () => "/",
      providesTags: ["Customers"],
    }),

    getCustomer: builder.query<Customer, string>({
      query: (uuid) => `/${uuid}`,
      providesTags: ["Customer"],
    }),

    createCustomer: builder.mutation<Customer, CreateCustomerFormData>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customers"],
    }),

    deleteCustomer: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/${uuid}`,
        method: "DELETE",
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

    updateStatus: builder.mutation<Customer, UpdateStatusFormData>({
      query: (body) => ({
        url: `/status`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customers"],
    }),

    getAccountSummary: builder.query<AccountSummary, string>({
      query: (uuid) => ({
        method: "POST",
        url: `/accountsummary/${uuid}`,
      }),
      providesTags: ["AccountSummary"],
    }),

    getRecibosCustomer:builder.query<Payment[], string>({
      query:(uuid)=>({
        method:'GET',
        url:`/recibos/${uuid}`,
        providesTags: ["Customer"],
      })
    })
  }),
});

export const {
  useCreateCustomerMutation,
  useGetCustomersQuery,
  useGetCustomerQuery,
  useGetRecibosCustomerQuery,
  useEditCustomerMutation,
  useUpdateStatusMutation,
  useGetAccountSummaryQuery,
  useDeleteCustomerMutation,
} = customerApi;
