import { addToken } from "@/interceptors";
import {
  CreateCuotasPayload,
  Cuota,
  CuotaFilters,
  UpdateCuotaPayload,
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
import { metricsApi } from "./metricsApi";
import {
  CreatePaymentForCuotasPayload,
  CuotaPayment,
} from "@/models/CuotaPayment";

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_API_URL}/v2/cuotas`,
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
    getCuotas: builder.query<Cuota[], CuotaFilters>({
      query: (filters) => ({
        url: "/",
        params: filters,
      }),
      providesTags: (result, error, arg) => {
        if (error || !result) return [{ type: "Cuotas", id: "LIST" }];

        return [
          // Global tag for the list of Cuotas, useful for invalidating the entire list
          { type: "Cuotas", id: "LIST" },
          // A tag tied specifically to this exact combination of filters
          { type: "Cuotas", id: `LIST_${JSON.stringify(arg)}` },
          // Individual entity tags for granular invalidation
          ...result.map((cuota) => ({
            type: "Cuotas" as const,
            id: cuota.uuid,
          })),
        ];
      },
    }),

    createCuotas: builder.mutation<Cuota[], CreateCuotasPayload>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),

      invalidatesTags: [{ type: "Cuotas", id: "LIST" }],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(metricsApi.util.invalidateTags(["Metrics"]));
      },
    }),

    createPaymentForCuotas: builder.mutation<
      CuotaPayment,
      CreatePaymentForCuotasPayload
    >({
      query: (body) => ({
        url: "/payments",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Cuotas", id: "LIST" }],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(metricsApi.util.invalidateTags(["Metrics"]));
      },
    }),

    generateAllCuotas: builder.mutation({
      query: () => ({
        url: "/generateAll",
        method: "POST",
      }),
      invalidatesTags: [{ type: "Cuotas", id: "LIST" }],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(metricsApi.util.invalidateTags(["Metrics"]));
        dispatch(customerApi.util.invalidateTags(["Customers"]));
      },
    }),

    reactivateCuota: builder.mutation<Cuota, string>({
      query: (uuid) => ({
        url: `${uuid}/reactivate`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Cuotas", id: "LIST" }],
    }),

    anularCuota: builder.mutation<Cuota, string>({
      query: (uuid) => ({
        url: `/${uuid}/mark-no-service`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Cuotas", id: "LIST" }],
    }),

    updateCuota: builder.mutation<Cuota, UpdateCuotaPayload>({
      query: ({ cuotaId, ...body }) => ({
        url: `/${cuotaId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Cuotas", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCuotasQuery,
  useCreateCuotasMutation,
  useGenerateAllCuotasMutation,
  useUpdateCuotaMutation,
  useReactivateCuotaMutation,
  useAnularCuotaMutation,
} = cuotasApi;
