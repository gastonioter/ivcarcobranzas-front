import { addToken } from "@/interceptors";
import {
  CreateProductFormValues,
  EditProductFormValues,
  Product,
} from "@/models/product";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api",
    prepareHeaders: addToken,
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
      providesTags: ["Product"],
    }),
    createProduct: builder.mutation<Product, CreateProductFormValues>({
      query: (newProduct) => ({
        url: `/products`,
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Product"],
    }),

    editProduct: builder.mutation<Product, EditProductFormValues>({
      query: ({ uuid, ...updatedProductData }) => ({
        url: `/products/${uuid}`,
        method: "PATCH",
        body: updatedProductData,
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetProductsQuery,
  useEditProductMutation,
} = productApi;
