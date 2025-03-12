import { BASE_URL } from "@/constants/baseURL";
import { addToken } from "@/interceptors";
import { CloudCategory } from "@/models/cloudCategories";
import { clearCredentials } from "@/redux/slices";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = async (args: any, api: any, extraOptions: any) => {
  const result = await fetchBaseQuery({
    baseUrl: `${BASE_URL}/cloudcategories`,
    prepareHeaders: addToken,
  })(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(clearCredentials());
  }

  return result;
};

export const cloudCategoryApi = createApi({
  reducerPath: "cloudCategoryApi",
  baseQuery,
  tagTypes: ["CloudCategories"],
  endpoints: (builder) => ({
    getCloudCategories: builder.query<CloudCategory[], void>({
      query: () => "/",
      providesTags: ["CloudCategories"],
    }),
  }),
});

export const { useGetCloudCategoriesQuery } = cloudCategoryApi;
