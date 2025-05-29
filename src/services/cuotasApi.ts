import { addToken } from "@/interceptors";
import {
  CreateCuotasPayload,
  Cuota,
  UpdateCuotaPayload,
  UpdateCuotasPayload,
} from "@/models/Cuota";
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

    createCuotas: builder.mutation<Cuota[], CreateCuotasPayload>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cuotas"],
    }),

    updateCuotas: builder.mutation<Cuota[], UpdateCuotasPayload>({
      query: (body) => ({
        url: "/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Cuotas"],
      onQueryStarted: async (body, { dispatch, queryFulfilled }) => {
        await queryFulfilled;

        dispatch(
          customerApi.util.invalidateTags([
            { type: "Recibos", id: body.customerId },
          ])
        );
      },
    }),

    generateAllCuotas: builder.mutation({
      query: () => ({
        url: "/generateAll",
        method: "POST",
      }),
      invalidatesTags: ["Cuotas"],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;

        dispatch(customerApi.util.invalidateTags(["Customers"]));
      },
    }),

    updateCuota: builder.mutation<Cuota, UpdateCuotaPayload>({
      query: ({ cuotaId, ...body }) => ({
        url: `/${cuotaId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Cuotas"],
    }),
  }),
});

export const {
  useGetCuotasQuery,
  useCreateCuotasMutation,
  useUpdateCuotasMutation,
  useGenerateAllCuotasMutation,
  useUpdateCuotaMutation,
} = cuotasApi;
