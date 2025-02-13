import { addToken } from "@/interceptors";
import { Category, CategoryFormData } from "@/models/category";
import { clearCredentials } from "@/redux/slices";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = async (args: any, api: any, extraOptions: any) => {
  const result = await fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_API_URL}/categories`,
    prepareHeaders: addToken,
  })(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(clearCredentials());
  }

  return result;
};

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery,
  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "/",
      providesTags: ["Categories"],
    }),

    createCategory: builder.mutation<Category, CategoryFormData>({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Categories"],
    }),
  }),
});

export const { useCreateCategoryMutation, useGetCategoriesQuery } =
  categoriesApi;
