import { addToken } from "@/interceptors";
import {
  CreateCustomerFormData,
  Customer,
  EditCustomerFormData,
  UpdateStatusFormData,
} from "@/models/customer";
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
    baseUrl: `${import.meta.env.VITE_BASE_API_URL}/sales`,
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

    updateStatus: builder.mutation<Customer, UpdateStatusFormData>({
      query: (body) => ({
        url: `/status`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customers"],
    }),

    getAccountSummary: builder.mutation<Customer, string>({
      query: (uuid) => ({
        method: "POST",
        url: `/${uuid}`,
      }),
    }),
  }),
});

export const {
  useCreateCustomerMutation,
  useGetCustomersQuery,
  useEditCustomerMutation,
  useUpdateStatusMutation,
} = customerApi;
