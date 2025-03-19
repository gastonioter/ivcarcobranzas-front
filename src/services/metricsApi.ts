import { addToken } from "@/interceptors";
import { clearCredentials } from "@/redux/slices";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

export interface MetricsType {
  actives: number;
  inactives: number;
  generatedCutoas: number;
  totalPaidAmounth: number;
}

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_API_URL}/metrics`,
    prepareHeaders: addToken,
  })(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(clearCredentials());
  }

  return result;
};
export const metricsApi = createApi({
  reducerPath: "metricsApi",
  baseQuery,
  endpoints: (builder) => ({
    getMetrics: builder.query<MetricsType, void>({
      query: () => "/",
    }),
  }),
});

export const { useGetMetricsQuery } = metricsApi;
