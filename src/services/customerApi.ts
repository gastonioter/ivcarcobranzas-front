import { addToken } from "@/interceptors";
import {
  AccountSummary,
  CreateCustomerFormData,
  Customer,
  CustomerFilters,
  EditCustomerFormData,
} from "@/models/customer";
import { clearCredentials } from "@/redux/slices";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { metricsApi } from "./metricsApi";

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_API_URL}/v2/customers`,
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
  tagTypes: ["Customers", "AccountSummary", "Recibos"],

  endpoints: (builder) => ({
    getCustomers: builder.query<Customer[], CustomerFilters>({
      query: (filters) => ({
        url: "/",
        params: filters,
      }),

      providesTags: ["Customers"],
    }),

    getCustomer: builder.query<Customer, string>({
      query: (uuid) => `/${uuid}`,
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
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;

        dispatch(metricsApi.util.invalidateTags(["Metrics"]));
      },
    }),

    editCustomer: builder.mutation<Customer, EditCustomerFormData>({
      query: ({ uuid, ...updatedCustomerData }) => ({
        url: `/${uuid}`,
        method: "PATCH",
        body: updatedCustomerData,
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
  }),
});

export const {
  useCreateCustomerMutation,
  useGetCustomersQuery,
  useGetCustomerQuery,
  useEditCustomerMutation,
  useGetAccountSummaryQuery,
  useDeleteCustomerMutation,
} = customerApi;
