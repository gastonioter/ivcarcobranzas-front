import { addToken } from "@/interceptors";
import { Settings } from "@/models/Settings";
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
    baseUrl: `${import.meta.env.VITE_BASE_API_URL}/settings`,
    prepareHeaders: addToken,
  })(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(clearCredentials());
  }

  return result;
};

const settingsApi = createApi({
  baseQuery,
  reducerPath: "settingsApi",
  tagTypes: ["Settings"],
  endpoints: (builder) => ({
    getSettings: builder.query<Settings, void>({
      query: () => "/",
      providesTags: ["Settings"],
    }),

    setSettings: builder.mutation({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const { useGetSettingsQuery, useSetSettingsMutation } = settingsApi;
