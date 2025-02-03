import { addToken } from "@/interceptors";
import { CreateProductSchemaType, Product } from "@/models/product";
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
    createProduct: builder.mutation<Product, CreateProductSchemaType>({
      query: (newProduct) => ({
        url: `/products`,
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const { useCreateProductMutation, useGetProductsQuery } = productApi;
