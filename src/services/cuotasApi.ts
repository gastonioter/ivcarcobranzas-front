import { addToken } from "@/interceptors";
import { CreateCuotaPayload, Cuota, UpdateCuotaPayload } from "@/models/Cuota";
import { clearCredentials } from "@/redux/slices/auth";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { customerApi } from "./customerApi";

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_API_URL}/cuotas`,
    prepareHeaders: addToken,
  })(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(clearCredentials());
  }

  return result;
};

export const cuotasApi = createApi({
  reducerPath: "cuotasApi",
  baseQuery,
  tagTypes: ["Cuotas"],
  endpoints: (builder) => ({
    getCuotas: builder.query<Cuota[], string>({
      query: (uuid) => `/${uuid}`,
      providesTags: ["Cuotas"],
    }),

    createCuota: builder.mutation<Cuota, CreateCuotaPayload>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cuotas"],
    }),

    updateCuotas: builder.mutation<Cuota[], UpdateCuotaPayload>({
      query: (body) => ({
        url: "/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Cuotas"],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;

        dispatch(customerApi.util.invalidateTags(["Customer"]));
      },
    }),
  }),
});

export const {
  useGetCuotasQuery,
  useCreateCuotaMutation,
  useUpdateCuotasMutation,
} = cuotasApi;
