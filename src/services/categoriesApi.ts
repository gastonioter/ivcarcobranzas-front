import { addToken } from "@/interceptors";
import { Category, CategoryFormData } from "@/models/category";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api/categories",
    prepareHeaders: addToken,
  }),
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
